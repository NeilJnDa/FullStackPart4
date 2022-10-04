const jwt = require('jsonwebtoken');
const logger = require('./logger');
const User = require('../models/user');

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method);
    logger.info('Path:  ', request.path);
    logger.info('Body:  ', request.body);
    logger.info('---');
    next();
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    } if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token',
        });
    }
    if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired',
        });
    }
    next(error);
};
const userExtractor = async (request, response, next) => {
    try {
        const { authorization } = request.headers;
        let token = '';
        if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
            token = authorization.substring(7);
        }
        // console.log('token in extractor', token);

        const decodedToken = jwt.verify(token, process.env.SECRET);
        // console.log(decodedToken);

        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' });
        }
        request.user = await User.findById(decodedToken.id);
        if (request.user === null) {
            return response.status(401).json({ error: 'Token invalid, no user is found' });
        }
        // console.log('extractor', request.user.toString());
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') response.status(401).json({ error: 'Invalid token' }).end();
        next(error);
    }
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    userExtractor,
};

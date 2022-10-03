const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const config = require('./utils/config');

const app = express();
const blogRouter = require('./controllers/blogRouter');
const middleware = require('./utils/middlewares');
const logger = require('./utils/logger');

logger.info('connecting to ', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB');
    })
    .then(() => {
        if (process.env.NODE_ENV === 'test') {
            logger.info('Database: test');
            mongoose.connection.useDb('test');
        } else {
            logger.info('Database: bloglist');
            mongoose.connection.useDb('bloglist');
        }
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message);
    });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/blogs', blogRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
module.exports = app;

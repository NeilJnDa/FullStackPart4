const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

const getTokenFrom = (request) => {
    console.log(request.headers);
    const { authorization } = request.headers;
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        console.log(authorization.substring(7));
        return authorization.substring(7);
    }
    return null;
};
blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user');
    response.json(blogs);
});
blogRouter.post('/', async (request, response) => {
    try {
        const blog = new Blog(request.body);
        console.log(blog);
        const token = getTokenFrom(request);
        const decodedToken = jwt.verify(token, process.env.SECRET);
        console.log(decodedToken);
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' });
        }
        blog.user = decodedToken.id;
        const savedBlog = await blog.save();
        response.status(201).json(savedBlog);
    } catch (error) {
        if (error.name === 'ValidationError') { response.status(400).send('Title and url can not be missing.').end(); }
    }
});
blogRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(200).end();
});
blogRouter.put('/:id', async (request, response) => {
    const blog = {
        likes: request.body.likes,
    };
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
    response.status(200).json(updatedBlog);
});
module.exports = blogRouter;

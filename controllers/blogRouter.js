const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});
blogRouter.post('/', async (request, response) => {
    try {
        const blog = new Blog(request.body);
        const savedBlog = await blog.save();
        response.status(201).json(savedBlog);
    } catch (error) {
        if (error.name === 'ValidationError') { response.status(400).end(); }
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

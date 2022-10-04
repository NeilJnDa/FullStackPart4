const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user');
    response.json(blogs);
});
blogRouter.post('/', async (request, response) => {
    try {
        const blog = new Blog(request.body);
        blog.user = User.find({})[0].id;
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

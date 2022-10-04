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
        blog.user = request.user;
        const savedBlog = await blog.save();
        response.status(201).json(savedBlog);
    } catch (error) {
        if (error.name === 'ValidationError') { response.status(400).send('Title and url can not be missing.').end(); }
    }
});
blogRouter.delete('/:id', async (request, response) => {
    const blogToRemove = await Blog.findById(request.params.id);
    // console.log(blogToRemove.user.toString());
    // console.log(request.user.toString());
    if (!blogToRemove) {
        response.status(400).json({ error: 'Can not find the blog by the id' });
    } else if (blogToRemove.user.toString() === request.user.id.toString()) {
        await Blog.findByIdAndRemove(request.params.id);
        response.status(200).end();
    } else {
        response.status(401).json({ error: 'You do not have the permission to delete blogs of others.' });
    }
});
blogRouter.put('/:id', async (request, response) => {
    const blog = {
        likes: request.body.likes,
    };
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
    response.status(200).json(updatedBlog);
});
module.exports = blogRouter;

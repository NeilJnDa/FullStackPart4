const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');
const helper = require('./test_helper');

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
});
test('Get Blogs with json type and a correct amount', async () => {
    const blogs = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    expect(blogs.body).toHaveLength(helper.initialBlogs.length);
});
test.only('Verifies that the unique identifier property of the blog posts is named id', async () => {
    const blogs = await api.get('/api/blogs');
    blogs.body.forEach((blog) => {
        console.log(blog);
        expect(blog.id).toBeDefined();
    });
});
afterAll(() => {
    mongoose.connection.close();
});

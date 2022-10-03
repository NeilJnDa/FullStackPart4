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
test('Verifies that the unique identifier property of the blog posts is named id', async () => {
    const blogs = await api.get('/api/blogs');
    blogs.body.forEach((blog) => {
        console.log(blog);
        expect(blog.id).toBeDefined();
    });
});
test('verifies POST request successfully creates a new blog post with correct format', async () => {
    const blog = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 5,
    };
    const newBlog = await api.post('/api/blogs')
        .send(blog)
        .expect(201)
        .expect('Content-Type', /application\/json/);
    expect(newBlog.body.id).toBeDefined();
    expect(newBlog.body.author).toBeDefined();
    expect(newBlog.body.url).toBeDefined();
    expect(newBlog.body.title).toBeDefined();
    expect(newBlog.body.likes).toBeDefined();
});
test(' verifies that if the likes property is missing from the request, it will default to the value 0', async () => {
    const blog = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    };
    const newBlog = await api.post('/api/blogs')
        .send(blog)
        .expect(201);
    expect(newBlog.body.likes).toBe(0);
});
test.only('verifies that if the title or url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request.', async () => {
    const blog1 = {
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    };
    const blog2 = {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
    };
    await api.post('/api/blogs')
        .send(blog1)
        .expect(400);
    await api.post('/api/blogs')
        .send(blog2)
        .expect(400);
});
afterAll(() => {
    mongoose.connection.close();
});

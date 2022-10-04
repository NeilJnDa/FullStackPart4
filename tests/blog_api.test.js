const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');

const helper = require('./test_helper');

const user = helper.initialUsers[0];
const defaultToken = helper.generateToken(user).toString();
// console.log(user);
// console.log(defaultToken);

beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
    await User.insertMany(helper.initialUsers);
});
describe('Get Request, fetch a blog', () => {
    test('Get Blogs with json type and a correct amount', async () => {
        // console.log(defaultToken);
        const blogs = await api.get('/api/blogs')
            .set('Authorization', `bearer ${defaultToken}`)
            .expect(200)
            .expect('Content-Type', /application\/json/);
        expect(blogs.body).toHaveLength(helper.initialBlogs.length);
    });
    test('Verifies that the unique identifier property of the blog posts is named id', async () => {
        const blogs = await api.get('/api/blogs')
            .set('Authorization', `bearer ${defaultToken}`);
        blogs.body.forEach((blog) => {
            expect(blog.id).toBeDefined();
        });
    });
    test('Verify user field is populated', async () => {
        const blogs = await api.get('/api/blogs')
            .set('Authorization', `bearer ${defaultToken}`);
        blogs.body.forEach((blog) => {
            expect(blog.user).toBeDefined();
            expect(blog.user.username).toBeDefined();
            expect(blog.user.name).toBeDefined();
        });
    });
});
describe('Post Request: Create a new blog', () => {
    test('verifies POST request successfully creates a new blog post with correct format', async () => {
        const blog = {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 5,
        };
        const newBlog = await api.post('/api/blogs')
            .set('Authorization', `bearer ${defaultToken}`)
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
            .set('Authorization', `bearer ${defaultToken}`)

            .send(blog)
            .expect(201);
        expect(newBlog.body.likes).toBe(0);
    });
    test('verifies that if the title or url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request.', async () => {
        const blog1 = {
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        };
        const blog2 = {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
        };
        await api.post('/api/blogs')
            .set('Authorization', `bearer ${defaultToken}`)
            .send(blog1)
            .expect(400);
        await api.post('/api/blogs')
            .set('Authorization', `bearer ${defaultToken}`)
            .send(blog2)
            .expect(400);
    });
    test('verifies if no a token is not provided, it returns 401 Unauthorized ', async () => {
        const blog = {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 5,
        };
        await api.post('/api/blogs')
            .send(blog)
            .expect(401)
            .expect('Content-Type', /application\/json/);
    });
});
describe('Delete request', () => {
    test('Verifies deleting a single blog post resource', async () => {
        const id = helper.initialBlogs[0]._id;
        await api.delete(`/api/blogs/${id}`)
            .set('Authorization', `bearer ${defaultToken}`)
            .expect(200);
    });
});
describe('Put request: modify the number of likes', () => {
    test('Verifies update the number of likes', async () => {
        const id = helper.initialBlogs[0]._id;
        const fieldToChange = {
            likes: 12,
        };
        const changedBlog = await api.put(`/api/blogs/${id}`)
            .set('Authorization', `bearer ${defaultToken}`)
            .send(fieldToChange)
            .expect(200);
        expect(changedBlog.body.likes).toBe(12);
    });
});
afterAll(() => {
    mongoose.connection.close();
});

const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
    await User.insertMany(helper.initialUsers);
});
afterAll(async () => {
    mongoose.disconnect();
});
describe('Create a new user', () => {
    test('Check if post is a success', async () => {
        const usersAtStart = await helper.usersInDb();
        const newUser = {
            username: 'Pac',
            name: 'Kino',
            password: 'password',
        };
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);
        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
        const usernames = usersAtEnd.map((u) => u.name);
        expect(usernames).toContain(newUser.name);
    });
    test('Name less then 3 characters, return 400', async () => {
        const newUser = {
            username: 'Pac',
            name: 'K',
            password: 'password',
        };
        const res = await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
        expect(res.error.text).toBe('Username or name must be at least 3 characters long.');
    });
    test('Username less then 3 characters, return 400', async () => {
        const newUser = {
            username: 'P',
            name: 'Kino',
            password: 'password',
        };
        const res = await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
        expect(res.error.text).toBe('Username or name must be at least 3 characters long.');
    });
    test('Password less then 3 characters, return 400', async () => {
        const newUser = {
            username: 'Pac',
            name: 'Kino',
            password: 'pa',
        };
        const res = await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
        expect(res.error.text).toBe('Password must be at least 3 characters long.');
    });
    test('Name already exists, return 400', async () => {
        const usersAtStart = await helper.usersInDb();
        const newUser = {
            username: usersAtStart[0].username,
            name: 'Kino',
            password: 'password',
        };
        const res = await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
        expect(res.error.text).toBe('Username must be unique.');
    });
});
describe('Get request', () => {
    test('Verify the blogs field is populated', async () => {
        const users = await api.get('/api/users');
        users.body.forEach((user) => {
            user.blogs.forEach((blog) => {
                expect(blog.id).toBeDefined();
                expect(blog.url).toBeDefined();
                expect(blog.title).toBeDefined();
            });
        });
    });
});

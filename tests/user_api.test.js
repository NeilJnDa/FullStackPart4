const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

beforeEach(async () => {
    await User.deleteMany({});
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
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
    });
    test('Username less then 3 characters, return 400', async () => {
        const newUser = {
            username: 'P',
            name: 'Kino',
            password: 'password',
        };
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
    });
    test('Password less then 3 characters, return 400', async () => {
        const newUser = {
            username: 'Pac',
            name: 'Kino',
            password: 'pa',
        };
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
    });
    test('Name already exists, return 400', async () => {
        const usersAtStart = await helper.usersInDb();
        const newUser = {
            username: usersAtStart[0].username,
            name: 'Kino',
            password: 'password',
        };
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400);
    });
});

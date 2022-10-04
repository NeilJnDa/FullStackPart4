const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0,
        user: '633b7ea89214f16decb4e5ea',
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0,
        user: '633b7ea89214f16decb4e5ea',

    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0,
        user: '633b7ea89214f16decb4e5ea',

    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0,
        user: '633b7ea89214f16decb4e5ea',

    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0,
        user: '633b7ea89214f16decb4e5ea',

    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0,
        user: '633b7ea89214f16decb4e5ea',

    },
];
const initialUsers = [
    {
        _id: '633b7ea89214f16decb4e5ea',
        username: 'Neko',
        name: 'Jinda Li',
        passwordHash: '123',
        blogs: [
            '5a422a851b54a676234d17f7',
            '5a422b891b54a676234d17fa',
        ],
    },
    {
        _id: '633b7edd9214f16decb4e5eb',
        username: 'Mimi',
        name: 'Dante',
        passwordHash: 'AVC',
        blogs: [
            '5a422a851b54a676234d17f7',
            '5a422b891b54a676234d17fa',
        ],
    },
];
const usersInDb = async () => {
    const users = await User.find({});
    return users.map((u) => u.toJSON());
};
const generateToken = (user) => {
    const userForToken = {
        username: user.username,
        id: user._id,
    };
    // It does not check password
    const token = jwt.sign(userForToken, process.env.SECRET);

    return token.toString();
};

module.exports = {
    initialBlogs,
    initialUsers,
    usersInDb,
    generateToken,
};

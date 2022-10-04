const userRouter = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

userRouter.post('/', async (request, response) => {
    try {
        const { username, name, password } = request.body;
        // Check password Length
        if (password.length < 3) {
            response.status(400).send('Password must be at least 3 characters long.').end();
        }
        const usernames = (await User.find({})).map((u) => u.username);
        // Check username uniqueness
        if (usernames.includes(username)) {
            response.status(400).send('Username must be unique.').end();
        }
        // Generate passwordHash
        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            name,
            passwordHash,
        });
        const savedUser = await user.save();
        response.status(201).json(savedUser);
    } catch (error) {
        if (error.name === 'ValidationError') { response.status(400).send('Username or name must be at least 3 characters long.').end(); }
    }
});
userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs');
    response.json(users);
});

module.exports = userRouter;

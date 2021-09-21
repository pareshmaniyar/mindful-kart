const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./User');
const app = express();
const { PORT, mongodbURL, REGISTER_URL, LOGIN_URL } = require('./constants');
const { JWT_SECRET_KEY } = require('./secretConstants');

mongoose.connect(
    mongodbURL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => {
        console.log('MongoDB is now in the party!');
    }
);

app.use(express.json());

app.post(REGISTER_URL, async (req, res) => {
    // TODO: validation
    const { name, email, password } = req.body;
    const userExists = await User.find({ email });
    console.log(userExists, email, name, password);
    if(userExists.length != 0) {
        return res.send({ message: 'Tough Luck! Already registered bruh!'});
    }
    const newUser = new User({ name, email, password });
    newUser.save(); // amazing if this stores in DB
    res.send('Registered like a pro, login bro');
});

app.post(LOGIN_URL, async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user || password !== user.password) {
        return res.json({ message: "One credential to rule them all, sadly doesn't match"});
    }
    jwt.sign({ email, name: user.name }, JWT_SECRET_KEY, (err, token) => {
        if(err) return res.send({ message: "Error signing" });
        else return res.json({ token });
    });
});

app.get('/', (req, res) => {
    res.send("Welcome to the future!");
});

app.listen(PORT, (req, res) => {
    console.log("Party has begun at port " + PORT);
});

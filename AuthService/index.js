const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const cookieSession = require('cookie-session');
const logger = require('morgan');
const mongoose = require('mongoose');
const User = require('./User');
const { PORT, mongodbURL, REGISTER_URL, LOGIN_URL } = require('./constants');
const { JWT_SECRET_KEY, COOKIE_KEY1, COOKIE_KEY2, SESSION_KEY } = require('./secretConstants');
require('./passport.js');

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

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger('dev'));
app.use(cookieSession({
    name: 'session',
    keys: [COOKIE_KEY1, COOKIE_KEY2]
}));

app.use(passport.initialize());
app.use(passport.session());

/*
app.post(REGISTER_URL, async (req, res) => {
    // TODO: validation
    const { name, email, password } = req.body;
    const userExists = await User.find({ email });
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
*/
app.get('/', (req, res) => res.send("Welcome to the future!"));
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}
app.get('/good', isLoggedIn, (req, res) => res.send(`Welcome mr ${req.user.name}!`))
app.get('/failed', (req, res) => res.send('You Failed to log in!'))

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/good');
  });

app.get('/logout', (req, res) => {
    req.session = null;
    req.logOut();
    res.redirect('/');
});

app.listen(PORT, (req, res) => {
    console.log("Party has begun at port " + PORT);
});

const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const logger = require('morgan');
const mongoose = require('mongoose');
const User = require('./User');
const { PORT, mongodbURL } = require('./constants');
const { COOKIE_KEY1, COOKIE_KEY2 } = require('./secretConstants');
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
app.get('/', (req, res) => res.send("Welcome to the future!"));

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.get('/good', isLoggedIn, (req, res) => {
    res.send(`Welcome Mr ${req.user.name}!`);
})

app.put('/user-update', isLoggedIn, async (req, res) => {
    const data = {};
    for(const key of ['name', 'number']) {
        if(!(key in req.body) || !req.body[key]) continue;
        data[key] = req.body[key];
    }
    const updatedDocs = await User.findByIdAndUpdate(req.user.id, data, {new: true});
    res.send({ 
        id: updatedDocs.id,
        name: updatedDocs.name,
        number: updatedDocs.number,
        email: updatedDocs.email
    });
});

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

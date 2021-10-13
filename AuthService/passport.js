const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('./secretConstants');
const User = require('./User.js');
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    const { id: googleId , name, email, picture } = profile._json;
    console.log(profile._json)
    User.findOne({ googleId }, (err, result) => {
      console.log("asdasd", err, result)
      if(err) {
        User.create({ googleId, name, email, picture }, (err, result) => {
          console.log(err, result)
          return cb(err, result);
        });
      } else {
        return cb(err, result)
      }
    });
  }
));

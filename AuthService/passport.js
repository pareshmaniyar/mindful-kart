const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./User.js');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = require('./secretConstants');

passport.serializeUser(function(user, done) {
  done(null, { id: user.id, name: user.name });
});

passport.deserializeUser(function(user, done) {
  // should have redis to check for valid key
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(_accessToken, _refreshToken, profile, cb) {
    const { sub: googleId , name, email, picture } = profile._json;
    try {
      const result = await User.findOne({ googleId });
      if(!result) {
        const createdNewUser = await User.create({ googleId, name, email, picture })
        return cb(null, createdNewUser);
      } else {
        return cb(null, result)
      }
    } catch (err) {
      return cb(err, result)
    }
  }
));

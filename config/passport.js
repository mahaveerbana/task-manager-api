const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

module.exports = function (passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create a user with Google profile data
      const user = await User.findOne({ where: { googleId: profile.id } });
      if (user) {
        return done(null, user);
      } else {
        // Create new user
        const newUser = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        });
        return done(null, newUser);
      }
    } catch (err) {
      return done(err, null);
    }
  }));

  // Serialize and deserialize user for sessions (if required)
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};

const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: process.env.TWITTER_CALLBACK_URL,
        includeEmail: false,
      },
      async (token, tokenSecret, profile, done) => {
        try {
          let user = await User.findOne({ twitterId: profile.id });

          if (!user) {
  user = await User.create({
    twitterId: profile.id,
    username: profile.displayName,
    handle: profile.username || profile.displayName,
    profileImage: profile.photos?.[0]?.value || ''
  });
}


          return done(null, user);
        } catch (err) {
          console.error(err);
          return done(err, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then(user => {
        if (!user) {
          // if user missing from DB, invalidate session
          return done(null, false);
        }
        return done(null, user);
      })
      .catch(err => done(err, null));
  });
};

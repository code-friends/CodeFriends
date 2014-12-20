var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var UserCollection = require('../models').collections.UserCollection;

passport.serializeUser(function (user, done) {
  return done(null, user.get('id'));
});

passport.deserializeUser(function (id, done) {
  new UserCollection()
    .query('where', 'id', '=', id)
    .fetchOne()
    .then(function (model) {
      return done(null, model);
    });
});

passport.use(new GitHubStrategy({
    clientID: '364ea3bc2b086177fd27',
    clientSecret: '2dce4e81ad618474f5c822b4567200b941a6c1b1',
    callbackURL: 'http://127.0.0.1:8000/auth/login/callback'
  },
  function (accessToken, refreshToken, profile, done) {
    // I'm not exactly sure when we use an accessToken and a refreshToken
    if (accessToken !== null) {
      new UserCollection()
        .query('where', 'githubAccessToken', '=', accessToken)
        .fetchOne()
        .then(function (user) {
          if (user) {
            done(null, user);
            return user;
          }
          return new UserCollection()
            .create({
              username: profile._json.login,
              githubId: profile._json.id,
              githubName: profile._json.name,
              githubEmail: profile._json.email,
              githubLocation: profile._json.location,
              githubAccessToken: accessToken,
              githubAvatarUrl: profile._json.avatar_url
            })
            .then(function (user) {
              if (user) {
                return done(null, user);
              }
              return done(null, null);
            });
        })
        .catch(function (err) {
          return done(null, false);
        });
    }
  }
));

passport.checkIfLoggedIn = function (req, res, next) {
  console.log('checkIfLoggedIn');
  if (req.user) {
    return next();
  }
  return res.status(401).send('You\'re not logged in');
};

module.exports = passport;
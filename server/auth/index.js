'use strict';

var config = require('config');
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var LocalStrategy = require('passport-local').Strategy;
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

console.log('Callback URL:', 'http://' + config.get('url') + ':' + config.get('ports').http + '/auth/login/callback');
passport.use(new GitHubStrategy({
    clientID: config.get('github').clientID,
    clientSecret: config.get('github').clientSecret,
    callbackURL: 'http://' + config.get('url') + ':' + config.get('ports').http + '/auth/login/callback'
  },
  function (accessToken, refreshToken, profile, done) {
    console.log(profile);
    // I'm not exactly sure when we use an accessToken and a refreshToken
    if (accessToken !== null) {
      new UserCollection()
        .query('where', 'githubAccessToken', '=', accessToken)
        .fetchOne()
        .then(function (user) {
          if (!user) throw new Error('No User Found');
          done(null, user);
          return user;
        })
        .catch(function () {
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
              if (!user) throw new Error('No User Found');
              return done(null, user);
            });
        })
        .catch(function (err) {
          console.log('Error:', err);
          return done(null, false);
        });
    }
  }
));

passport.use(new LocalStrategy({
    usernameField: 'email',
  },
  function (email, password, done) {
    UserCollection
      .query('where', 'email', '=', email)
      .fetchOne()
      .then(function (user) {
        return user.checkPassword(password)
          .then(function (isMatch) {
            if (!isMatch) {
              return done(null, false);
            }
            return done(null, user);
          });
      })
      .catch(function () {
        return done(null, false);
      });
  }
));

passport.checkIfLoggedIn = function (req, res, next) {
  if (req.user) {
    return next();
  }
  return res.status(401).send('You\'re not logged in');
};

module.exports = passport;
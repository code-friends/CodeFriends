'use strict';

var authController = {};
var UserCollection = require('../models').collections.UserCollection;
var User = require('../models').models.User;

authController.getUser = function (req, res) {
  var userId = null;
  var userName = null;
  var email = null;
  var githubAvatarUrl = 'http://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y';
  if (req.user && req.user.get('id') && typeof req.user.get('id') === 'number') {
    userId = req.user.get('id');
    email = req.user.get('email');
    userName = req.user.get('username') || email;
    githubAvatarUrl = req.user.get('githubAvatarUrl') || githubAvatarUrl;
  }
  res.json({
    userId: userId,
    // userName: req.user.get('username'),
    userName: userName,
    email: email,
    githubAvatarUrl: githubAvatarUrl
  });
};

authController.logout = function (req, res) {
  req.logout();
  res.redirect('/');
};

authController.login = function (req, res) {
  res.redirect('/#/home');
};

authController.signup = function (req, res) {
  var email = req.body.email || req.param('email');
  var password = req.body.password || req.param('password');
  if (!email || !password) {
    res.status(400).end(); // Client Error
    return;
  }

  new UserCollection()
    .query('where', 'email', '=', email)
    .fetchOne()
    .then(function (user) {
      if (user !== null) {
        res.redirect('/#/home');
        return;
      }
      new User({
          email: email,
          password: password
        }).save()
        .then(function () {
          res.redirect('/#/home');
        });
    });
};

module.exports = authController;
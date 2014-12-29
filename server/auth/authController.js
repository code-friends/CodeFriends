var authController = {};
var UserCollection = require('../models').collections.UserCollection;
var User = require('../models').models.User;

authController.getUser = function (req, res) {
  var userId = null;
  if (req.user && req.user.get('id') && typeof req.user.get('id') === 'number') {
    userId = req.user.get('id');
  }
  res.json({
    userId: userId,
  });
};

authController.logout = function (req, res) {
  res.logout();
  res.status(200).end();
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
      var user = new User({
          email: email,
          password: password
        }).save()
        .then(function (userModel) {
          res.redirect('/#/home');
        });
    });
};

module.exports = authController;
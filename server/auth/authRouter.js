var express = require('express');
var authControllers = require('./authController');

var auth = require('./index');
var authRouter = express.Router();

authRouter.use('/login/callback', auth.authenticate('github'), function (req, res) {
  console.log('USER AUTHENTHICAD CALLBACK');
  // Successful authentication, redirect home.
  res.send('you\'re logged in');
});
authRouter.use('/login', auth.authenticate('github'), authControllers.login);
authRouter.use('/logout', authControllers.logout);
authRouter.use('/signup', authControllers.signup);

module.exports = authRouter;
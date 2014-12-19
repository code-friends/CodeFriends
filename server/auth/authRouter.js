var express = require('express');
var authControllers = require('./authController');

var authRouter = express.Router();

authRouter('/login', authControllers.login);
authRouter('/logout', authControllers.logout);
authRouter('/signup', authControllers.signup);

module.exports = authRouter;
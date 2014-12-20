var userController = require('./userController.js');
var express = require('express');

var userRouter = express.Router();

userRouter.post('/', userController.post);
userRouter.get('/', userController.getAllUsers);
userRouter.put('/', userController.put);
userRouter.delete('/', userController.delete);

module.exports = userRouter;
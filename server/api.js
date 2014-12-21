var authRouter = require('./auth/authRouter');
var projectRouter = require('./project/projectRoutes');
var userRouter = require('./user/userRoutes');
var fileRouter = require('./file/fileRouter');
var express = require('express');

var apiRouter = express.Router();

apiRouter.use('/file', projectRouter);
apiRouter.use('/project', projectRouter);
apiRouter.use('/user', userRouter);

module.exports = apiRouter;
var projectRouter = require('./project/projectRoutes.js');
var userRouter = require('./user/userRoutes.js');
var express = require('express');

var apiRouter = express.Router();

apiRouter.use('/project', projectRouter);
apiRouter.use('/user', userRouter);

module.exports = apiRouter;
var authRouter = require('./auth/authRouter');
var projectRouter = require('./project/projectRoutes');
var userRouter = require('./user/userRoutes');
var fileRouter = require('./file/fileRouter');
var uploadRouter = require('./upload/uploadRouter');
var downloadRouter = require('./download/downloadRouter');
var express = require('express');

var apiRouter = express.Router();

apiRouter.use('/file', fileRouter);
apiRouter.use('/project', projectRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/upload', uploadRouter);
apiRouter.use('/download', downloadRouter);

module.exports = apiRouter;
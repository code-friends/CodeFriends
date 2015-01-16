'use strict';

var projectRouter = require('./project/projectRoutes');
var userRouter = require('./user/userRoutes');
var fileRouter = require('./file/fileRouter');
var templateRouter = require('./template/templateRouter');
// var uploadRouter = require('./upload/uploadRoutes');
// var downloadRouter = require('./download/downloadRoutes');
var express = require('express');

var apiRouter = express.Router();

apiRouter.use('/file', fileRouter);
apiRouter.use('/project', projectRouter);
apiRouter.use('/template', templateRouter);
apiRouter.use('/user', userRouter);
// apiRouter.use('/upload', uploadRouter);
// apiRouter.use('/download', downloadRouter);

module.exports = apiRouter;
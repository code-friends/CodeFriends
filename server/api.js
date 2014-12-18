//creates overall router
var express = require('express');

//sub-routers
var authRouter = require('./auth/index.js'); //MAY NEED TO UPDATE BASED ON WHAT PASSPORT ADDS TO AUTH
var projectRouter = require('./project/projectRoutes.js');
var userRouter = require('./user/userRoutes.js');

//instantiates an instance of the express router
var apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/project', projectRouter);
apiRouter.use('/user', userRouter);

module.export = apiRouter;

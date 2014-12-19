var projectRouter = require('./project/projectRoutes.js');
var userRouter = require('./user/userRoutes.js');
var express = require('express');

module.exports = function router(app){
  app.use('/auth', authRouter);
  app.use('/project', projectRouter);
  app.use('/user', userRouter);
  //all other routes go to index.html

  app.route('/*')
    .get(function(req, res){
      res.sendfile('client/index.html');
    });
}

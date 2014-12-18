var authRouter = require('./auth/index.js'); //MAY NEED TO UPDATE BASED ON WHAT PASSPORT ADDS TO AUTH
var projectRouter = require('./project/project.routes.js');
var userRouter = require('./user/user.routes.js');

module.exports = function router(app){
  app.use('/auth', authRouter);
  app.use('/project', projectRouter);
  app.use('/user', userRouter);

  //all other routes go to index.html
  app.use('/*', )
    .get(function(req, res){
      res.sendfile('client/index.html');
    });
}

module.exports = apiRouter;
var userController = require('./userController.js');

module.exports = function(router){

  router.post('/', userController.PLACEHOLDER );    //NEED TO ADD THE NAME OF THE FUNCTION IN PROJECTCONTROLLER
  router.get('/', userController.PLACEHOLDER );     //NEED TO ADD THE NAME OF THE FUNCTION IN PROJECTCONTROLLER 
  router.post('/', userController.PLACEHOLDER );    //NEED TO ADD THE NAME OF THE FUNCTION IN PROJECTCONTROLLER
  router.delete('/', userController.PLACEHOLDER );  //NEED TO ADD THE NAME OF THE FUNCTION IN PROJECTCONTROLLER
  
};


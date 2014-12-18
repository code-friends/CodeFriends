var userController = require('./userController.js');

var userRouter = express.Router();

userRouter.post('/', userController.post);  
userRouter.get('/', userController.get);    
userRouter.put('/', userController.put);
userRouter.delete('/', userController.delete);

module.exports = userRouter;

const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);

userRouter //users
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRouter //users
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateeUser)
  .delete(userController.deleteUser);

module.exports = userRouter;

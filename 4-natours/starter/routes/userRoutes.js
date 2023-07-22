const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

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

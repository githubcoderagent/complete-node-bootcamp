const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Enter name'],
  },
  email: {
    type: String,
    required: [true, 'provide email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Valid email'],
  },
  phote: String,
  password: {
    type: String,
    required: [true, 'password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'confirm password'],
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

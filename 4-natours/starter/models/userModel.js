const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//const catchAsync = require('../utils/catchAsync');

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
  photo: String,
  password: {
    type: String,
    required: [true, 'password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'confirm password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords not the same',
      select: false,
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  } //if
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// userSchema.pre(
//     'save',
//     catchAsync(async function (next) {
//       if (!this.isModified('password')) {
//         return next();
//       } //if
//       this.password = await bcrypt.hash(this.password, 12);
//       this.passwordConfirm = undefined;
//       next();
//     }),
//   );

const User = mongoose.model('User', userSchema);

module.exports = User;

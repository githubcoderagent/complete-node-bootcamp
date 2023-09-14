//const util = require('util');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  //const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser.name,
      email: newUser.email,
      passwordChangedAt: newUser.passwordChangedAt,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please privide email and password', 400));
  } //if
  const user = await User.findOne({ email: email }).select('+password');
  //const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  } //if
  const token = signToken(user._id);
  res.status(200).json({
    stutus: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    //nothing
    token = req.headers.authorization.split(' ')[1];
  } //if
  if (!token) {
    return next(new AppError('You are not logged in!', 401));
  } //if
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  logger.debug(JSON.stringify(decoded));

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('user no longer exists for this token', 401));
  } //if

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('pwd changed. log in again', 401));
  } //if

  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    //roles is an array
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission', 403));
    } //if
    next();
  };

const AppError = require('../utils/appError');
const logger = require('../utils/logger');

const handleCastErrorDB = (err) => {
  const message = `Invalid $(err.path): ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}. Use another value';`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = `${Object.values(err.errors)
    .map((el) => el.message)
    .join('. ')}.`;
  const message = `Invalid input data. ${errors}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token', 401);
const handleJWTExpiredError = () => new AppError('Token expired', 401);

const sendErrorDev = (err, res) => {
  logger.silly(JSON.stringify(err));
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  logger.silly(JSON.stringify(err));
  //console.error('ERROR', err);
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } //if
  else {
    //console.error('ERROR', err);
    //logger.debug(err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  } //else
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'unhandled error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } //if
  else {
    let error = { ...err }; //does not copy name
    //let error = { ...getAllKeysConditionally(err) };
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    } //if
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    } //if
    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    } //if
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    } //if
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    } //if
    sendErrorProd(error, res);
  } //else
};

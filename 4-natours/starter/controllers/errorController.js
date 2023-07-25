const AppError = require('../utils/appError');

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

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } //if
  else {
    //console.error('ERROR', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  } //else
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
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
    sendErrorProd(error, res);
  } //else
};

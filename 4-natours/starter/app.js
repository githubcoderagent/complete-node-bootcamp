const express = require('express');
const morgan = require('morgan');
const logger = require('./utils/logger');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//middleware
const myStream = {
  write: (text) => {
    logger.http(text);
  },
};

if (process.env.NODE_ENV === 'development') {
  //app.use(morgan('dev'));
  app.use(morgan('dev', { stream: myStream }));
} //if
else {
  app.use(morgan('combined', { stream: myStream }));
} //else
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //logger.info(JSON.stringify(req.headers));
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`$cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// logger.error('test error message');
// logger.warn('test warning message');
// logger.info('test info message');
// logger.http('test http message');
// logger.verbose('test verbose message');
// logger.debug('test debug message');
// logger.silly('tes silly messeage');

module.exports = app;

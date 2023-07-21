const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// const notDoneYet = {
//   status: 'error',
//   message: 'not done yet',
//   data: {
//     message: 'not done yet',
//   },
// };

//middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} //if
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `$cannot find ${req.originalUrl} on this server`,
  });
});

module.exports = app;

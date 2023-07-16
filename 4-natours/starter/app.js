const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

const jo_notDoneYet = 
    {
        status: 'error',
        message: 'not done yet',
        data: {
            message: 'not done yet',
        }
    };

//middleware
if ('development' === process.env.NODE_ENV) {
    app.use(morgan('dev'));
}   //if
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
    res.notDoneYet = function() {
        return res.status(500).json(jo_notDoneYet);
    }
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

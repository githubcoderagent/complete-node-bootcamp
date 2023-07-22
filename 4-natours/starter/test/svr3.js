// const express = require('express');

// const app = express();

// app.get('/', (req, res) => res.json({ ping: true }));

// const server = app.listen(3000, () => console.log('Running…'));

// setInterval(
//   () =>
//     server.getConnections((err, connections) =>
//       console.log(`${connections} connections currently open`),
//     ),
//   1000,
// );

// let connections = [];

// server.on('connection', (connection) => {
//   connections.push(connection);
//   connection.on(
//     'close',
//     () => (connections = connections.filter((curr) => curr !== connection)),
//   );
// });

// function shutDown() {
//   console.log('Received kill signal, shutting down gracefully');
//   server.close(() => {
//     console.log('Closed out remaining connections');
//     process.exit(0);
//   });

//   setTimeout(() => {
//     console.error(
//       'Could not close connections in time, forcefully shutting down',
//     );
//     process.exit(1);
//   }, 10000);

//   connections.forEach((curr) => curr.end());
//   setTimeout(() => connections.forEach((curr) => curr.destroy()), 5000);
// }
// process.on('SIGTERM', shutDown);
// process.on('SIGINT', shutDown);

const express = require('express');
const winston = require('winston');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const logger = winston.createLogger({
  // Log only if level is less than (meaning more severe) or equal to this
  level: 'info',
  // Use timestamp and printf to create a standard log format
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  ),
  // Log to the console and a file
  //if (process.env.NODE_ENV === 'development') {
  //transports: [process.env.NODE_ENV === 'development' ? this.consoleLogger : this.stackdriverLogger]
  //transports: [process.env.NODE_ENV === 'development' ? new winston.transports.Console() : new winston.transports.File({ filename: 'logs/proapp.log' })]
  transports: [
    //new winston.transports.Console(),
    //new winston.transports.File({ filename: 'logs/proapp.log' }),
    process.env.NODE_ENV === 'development'
      ? new winston.transports.Console()
      : new winston.transports.File({ filename: 'logs/proapp.log' }),
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
});
logger.info(`App is running in ${process.env.NODE_ENV} mode.`);
const app = express();
const port = 3000;

app.use((req, res, next) => {
  // Log an info message for each incoming request
  logger.info(`Received a ${req.method} request for ${req.url}`);
  next();
});
// Handle HTTP GET requests to the root path
app.get('/', (req, res) => {
  // Log messages at different log levels
  logger.log('error', 'This is an error message');
  logger.log('warn', 'This is a warning message');
  logger.log('info', 'This is an info message');
  logger.log('verbose', 'This is a verbose message');
  logger.log('debug', 'This is a debug message');
  logger.log('silly', 'This is a silly message');
  // Send a response to the client
  res.send('Hello, world!');
});
// A route for manually triggering an error
app.get('/error', (req, res, next) => {
  throw new Error('This is a test error');
});
// Handle errors using the logger
app.use((err, req, res, next) => {
  // Log the error message at the error level
  logger.error(err.message);
  res.status(500).send();
});
// Start the app and listen on the specified port
app.listen(port, () => {
  logger.log('info', `App listening on port ${port}!`);
});

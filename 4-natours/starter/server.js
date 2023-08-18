//const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
//const dotenv = require('dotenv');
const logger = require('./utils/logger');

//dotenv.config({ path: './config.env' });
const app = require('./app');

process.on('uncaughtException', (err) => {
  logger.error('shutting down due to error');
  logger.error(err.name, err.message);
  process.exit(1);
});

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD,
// );

const DB = process.env.DATABASE_LOCAL;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
  })
  .then(() => logger.verbose('DB connection success'))
  .finally(() => logger.verbose('DB connect FAILED'));

//start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.verbose(`app running ${port}`);
});

//set this to 1 second to fill logs for testing purposes
// setInterval(
//   () =>
//   nothing
//     server.getConnections((err, connections) => {
//       if (connections >= 0) {
//         logger.silly(`${connections} connections currently open`);
//       }
//     }),
//   process.env.NODE_ENV === 'development' ? 1000 : 10000,
// );

let connections = [];

server.on('connection', (connection) => {
  connections.push(connection);
  connection.on('close', () => {
    connections = connections.filter((curr) => curr !== connection);
  });
});

function shutDown() {
  logger.warn('Received kill signal, shutting down gracefully');
  server.close(() => {
    logger.warn('Closed out remaining connections');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error(
      'Could not close connections in time, forcefully shutting down',
    );
    process.exit(1);
  }, 10000);

  connections.forEach((curr) => curr.end());
  setTimeout(() => connections.forEach((curr) => curr.destroy()), 5000);
}
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

process.on('unhandledRejection', (err) => {
  logger.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

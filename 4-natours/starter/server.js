//const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('./utils/logger');

dotenv.config({ path: './config.env' });
const app = require('./app');

process.on('uncaughtException', (err) => {
  logger.error('shutting down due to error');
  logger.error(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
  })
  .then(() => logger.info('DB connection success'));

//start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  logger.info(`app running ${port}`);
});

setInterval(
  () =>
    server.getConnections((err, connections) =>
      logger.silly(`${connections} connections currently open`),
    ),
  10000,
);

let connections = [];

server.on('connection', (connection) => {
  connections.push(connection);
  connection.on('close', () => {
    connections = connections.filter((curr) => curr !== connection);
  });
});

function shutDown() {
  logger.info('Received kill signal, shutting down gracefully');
  server.close(() => {
    logger.info('Closed out remaining connections');
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

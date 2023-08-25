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

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

//const DB = process.env.DATABASE_LOCAL;

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://<username>:<password>@clusternatoursapp.vlmm75e.mongodb.net/?retryWrites=true&w=majority";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
    //useUnifiedTopology: true,
    heartbeatFrequencyMS: 15000,
    autoIndex: true,
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  })
  .then(() => logger.verbose('DB connection success'))
  .catch(() => {
    logger.verbose('DB connect FAILED');
    mongoose.disconnect();
  });

mongoose.connection.on('connected', () => {
  logger.debug(`MongoDB connection successful!`);
  logger.info('success');
});

mongoose.connection.on('error', (err) => {
  logger.debug(`MongoDB connection error => ${err}!`);
});

mongoose.connection.on('disconnected', () => {
  logger.debug(`MongoDB connection disconnected`);
});

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

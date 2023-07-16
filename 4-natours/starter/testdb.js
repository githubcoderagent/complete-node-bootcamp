const { MongoClient } = require('mongodb');

const uri =
  'mongodb+srv://testuser:testpass123@clusternatoursapp.vlmm75e.mongodb.net/?retryWrites=true&w=majority';

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!',
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

/* 
const { MongoClient } = require('mongodb');

const uri =
  'mongodb://testuser:testpass123@ac-bj5kwiq-shard-00-00.vlmm75e.mongodb.net:27017,ac-bj5kwiq-shard-00-01.vlmm75e.mongodb.net:27017,ac-bj5kwiq-shard-00-02.vlmm75e.mongodb.net:27017/?ssl=true&replicaSet=atlas-ig63nq-shard-0&authSource=admin&retryWrites=true&w=majority';
MongoClient.connect(uri, (err, client) => {
  const collection = client.db('test').collection('devices');
  // perform actions on the collection object
  client.close();
});
 */
/* const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =
  //'mongodb+srv://testuser:testpass123@clusternatoursapp.vlmm75e.mongodb.net/natours?retryWrites=true&w=majority';
  'mongodb://testuser:testpass123@ac-bj5kwiq-shard-00-00.vlmm75e.mongodb.net:27017,ac-bj5kwiq-shard-00-01.vlmm75e.mongodb.net:27017,ac-bj5kwiq-shard-00-02.vlmm75e.mongodb.net:27017/?ssl=true&replicaSet=atlas-ig63nq-shard-0&authSource=admin&retryWrites=true&w=majority';

MongoClient.connect(uri, (err, client) => {
  const collection = client.db('natours').collection('tours');
  // perform actions on the collection object
  client.close();
});
 */

/*   // Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!',
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
 */

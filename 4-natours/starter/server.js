const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection success');
  });

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Must have a name'],
    unique: true,
  },
  rating: {
      type: Number,
      default: 4.0,
  },
  price: {
    type: Number,
    required: [true, 'Must have a price'],
  },
});
//start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running ${port}`);
});

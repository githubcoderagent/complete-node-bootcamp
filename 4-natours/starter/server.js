const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');
//start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running ${port}`);
});

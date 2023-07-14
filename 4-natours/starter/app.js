const express = require('express');

const app = express();

app.get('/', (req, res) => {
    //res.status(200).send('hello');
    res.json({message: 'hello', app: 'name'});
});
app.post('/', (req, res) => {
    res.send('post here');
});

const port = 3000;

app.listen(port, () => {
    console.log(`app running ${port}`);
});

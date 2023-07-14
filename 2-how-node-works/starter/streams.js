const fs = require('fs');
const server = require('http').createServer();

var cnt = 1;
server.on('request', (req, res) => {
    // fs.readFile('test-file.txt', (err, data) => {
    //     if (err)
    //     {
    //         console.log(err);
    //     }
    //     res.end(data);
    // });
    // const readable = fs.createReadStream('test-file.txt');
    // readable.on('data', chunk => {
    //     res.write(`<h1>chunk ${cnt} sent...</h1>`);
    //     cnt++;
    //     res.write(chunk);
    // });
    // readable.on('end', () => {
    //     res.end();
    // });
    // readable.on('error', err => {
    //     console.log(err);
    //     res.statusCode = 500;
    //     res.end('file not found');

    // })

    const readable = fs.createReadStream('test-file.txt');
    readable.pipe(res);
});

server.listen(8000, 'localhost', () => {
    console.log('listening');
});

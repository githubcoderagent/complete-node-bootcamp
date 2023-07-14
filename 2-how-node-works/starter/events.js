const EventEmitter = require('events');
const http = require('http');

class Sales extends EventEmitter
{
    constructor()
    {
        super();
    }
}
const myEmitter = new Sales();

myEmitter.on('newSale', () => {
    console.log('new salie');
});
myEmitter.on('newSale', () => {
    console.log('customer name');
});
myEmitter.on('newSale', stock => {
    console.log(`Now ${stock} items`);
})
myEmitter.emit('newSale', 9);

const server = http.createServer();
server.on('request', (req, res) => {
    console.log('request received');
    console.log(req.url);
    res.end('request recieved');
});
server.on('request', (req, res) => {
    console.log('another recieved');
});
server.on('close', (req, res) => {
    console.log('close recieved');
});

server.listen(8000, 'localhost', () => {
    console.log('waiting');
});

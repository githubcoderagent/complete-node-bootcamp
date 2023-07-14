const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

//const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
//console.log(textIn);
//const textOut = `test ${textIn}\nnext line ${new Date(Date.now()).toLocaleString('en-GB')}`;
//fs.writeFileSync('./txt/output.txt', textOut);
//console.log('file write');

//non blocking
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('merged');
//             });
//         });
//     });
// });
// myfunc('', 'Bye');
// console.log('will read');

// function myfunc(err, data) {
//     console.log(data);
// };

//server
// const server = http.createServer((req, res) => {
//     res.end('hello from svr2');
// });

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

//why not dynamic slugs?
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer(firstListener);

// server.listen(8000, 'localhost', () => {
//     console.log('server started');
// });

server.listen(8000, 'localhost', startWebServer);

function firstListener(req, res)
{
  const { query, pathname } = url.parse(req.url, true);
  if ('/overview' === pathname) 
  {
    res.writeHeader(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj
      .map((el) => replaceTemplate.replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARD%}', cardsHtml);
    res.end(output);
  }
  else if ('/product' === pathname) 
  {
    console.log('calling test!!!');
    replaceTemplate.test();
    //console.log(dataObj[0]);

    //console.log(query);
    //console.log(query.id);

    res.writeHeader(200, { 'Content-type': 'text/html' });
    const myProduct = dataObj[query.id];
    //console.log(myProduct);
    const output = replaceTemplate.replaceTemplate(tempProduct, myProduct);
    res.end(output);
  }
  else if ('/api' === pathname) 
  {
    res.writeHeader(200, { 'Content-type': 'application/json' });
    res.end(data);
    //console.log('calling read data file everytime hitting api');
    //fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', readDataFile);
    // fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) =>
    // {
    //     const productData = JSON.parse(data);
    //     //console.log(productData);
    //     res.writeHeader(200, {'Content-type': 'application/json'});
    //     res.end(data);
    // });
  }
  else if ('/' === pathname) 
  {
    res.end('This is the HOMEPAGE');
  }
  else 
  {
    res.writeHeader(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found</h1>');
  }
}

function startWebServer(req, res) {
  console.log('really started server555');
}

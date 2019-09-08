const express = require('express');
const app = express(); //express() returns object;
const port = 3000;

app.use(express.static('public')); //where static files exist

app.get('/dynamic', (req, res) => {
    let lis = '';
    for (let i = 0; i < 5; i++) {
        lis += `<li>coding${i+1}</li>`
    }
    let time = Date();
    let output = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        Hello Dynamic(HTML)!
        <ul>
        ${lis}
        </ul>
        Current Time : ${time}
    </body>
    </html>
    `;
    res.send(output);
})
app.get('/imgroute', (req, res) => 
    res.send('Hello Router, <img src="/star.png">'));
app.get('/', (req, res) => 
    res.send(`Hello World!`));
app.get('/login', (req, res) => res.send('<h1>Login Please</h1>'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// http.createServer( (req, res) => {
//     res.writeHead(200, {'Content-Type' : 'text/plain'});
//     res.end('Hello World\n');
// }).listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });

const express = require('express');
const app = express(); //express() returns object;
const port = 3000;

app.use(express.static('public')); //where static files exist

app.set('views', './views');
app.set('view engine', 'pug');

if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

app.get('/form', (req, res) => {
    res.render('form');
})

app.get('/form_receiver', (req, res) => {
    let title = req.query.title;
    let description  = req.query.description;
    res.send(`title ---> ${title}, description ---> ${description}`)
})

app.get('/topicParam/:id/:name', (req, res) => {
    let topicId = req.params.id;
    let topicName = req.params.name;
    // console.dir(topicId);
    let topics = [
        'Javascript is ...',
        'Nodejs is ...',
        'Express is...'
    ];
    console.dir(req.params) //{ id: '0', name: 'js' }

    res.send(links = `
    <a href='/topic/0/js'>Javascript</a><br>
    <a href='/topic/1/js'>Nodejs</a><br> 
    <a href='/topic/2'>Express</a><br><br>
    <div>${topics[topicId]}<span>${topicName}</span</div>

`)

})

app.get('/topicQuery', (req, res) => {
    let topicId = req.query.id,
        topicName = req.query.name;
    let topics = [
        'Javascript is ...',
        'Nodejs is ...',
        'Express is...'
    ];
    var links = `
        <a href='/topic?id=0'>Javascript</a><br>
        <a href='/topic?id=1'>Nodejs</a><br> 
        <a href='/topic?id=2'>Express</a><br><br>
        <div>${topics[topicId]}</div>
    `;
    res.send(links);
    // res.send(`Id = ${topicId}, Name = ${topicName}`);
    // console.dir(topicId)
    // http://localhost:3000/topic?id[one]=1&id[two]=2&name=good
});

app.get('/prettify', (req, res) => {
    res.render('beforePrettified');
})
app.get('/pug', (req, res) => {
    res.render('index', { title : 'Pug Practice', message: 'Hi there!', time: Date() });
});

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

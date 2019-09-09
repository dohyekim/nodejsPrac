const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express(); //express() returns an object;
const port = 3000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use(express.static('public')); //where static files exist
app.use(bodyParser.urlencoded({ extended: false})); //applicaion으로 들어오는 모든 요청들은 bodyParser라고 하는 미들웨어를 먼저 통과한 다음에 route가 동작하게 된다.

app.set('views', './views');
app.set('view engine', 'pug'); //어떤 template engine을 사용할 건지

if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

app.get('/program/:prog', (req, res) => {
    let prog = req.params.prog;
    fs.readdir('data', {encoding:'utf-8'}, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }

        fs.readFile('data/'+prog, {encoding: 'utf-8'}, (err, data) => {
            if(err) {
                res.status(500).send('Internal Server Error');
            }
            res.render('program', {progs: files, title: prog, description: data});
        })
    })
    
})

app.get('/program', (req, res) => {
    fs.readdir('data', {encoding:'utf-8'}, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('program', {progs: files});
    })
});

app.post('/program', (req, res) => {
    let title = req.body.title,
        description = req.body.description;
    fs.writeFile('data/'+title, description, (err) => {
        if(err) {
            res.status(500).send('Internal Server Error');
        };

    });
    // res.render('program', {title: title, description: description});
});

app.get('/program/new', (req, res) => {
    res.render('newform');
});

app.get('/form', (req, res) => {
    res.render('form');
});

app.post('/form_receiver', (req, res) => {
    let title = req.body.title,
        description = req.body.description;
    res.send(`Hello, POST method. <br>
                title is... ${title} <br>
                Description is...${description}`)
})

app.get('/form_receiver', (req, res) => {
    let title = req.query.title; //get 방식이니까 가능한 것
    let description  = req.query.description; //get 
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


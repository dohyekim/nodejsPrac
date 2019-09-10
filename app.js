const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express(); //express() returns an object;
const port = 3000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use(express.static('public')); //where static files exist
app.use(bodyParser.urlencoded({ extended: false})); //applicaion으로 들어오는 모든 요청들은 bodyParser라고 하는 미들웨어를 먼저 통과한 다음에 route가 동작하게 된다.
app.use(cookieParser('salt!!!!!!a0w9et2350ak3l')); // 애플리케이션으로 들어오는 정보 중에 cookie를 갖고 있는 요청이 들어오면 얘가 그걸 해석해서 req/res의 cookie관련 작업을 진행할 수 있도록 해줌
app.use(session({
    secret: 'thYisiWs@%se5@s6Qsio^Wynsaltwow3w', //session ID를 심을 때 첨가될 salt
    resave: false, // sessionID를 접속할 때마다 새로 발급하지 마라 
    saveUninitialized: true //session ID를 실제로 사용하기 전까지는 발급하지 마라
}))

app.set('views', './views');
app.set('view engine', 'pug'); //어떤 template engine을 사용할 건지

if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

let products = {
    1:{title: 'The history of web 1'},
    2:{title: 'The next web'},
}; //연습용으로, database를 대신하는 객체

//Logout
app.get('/auth/logout', (req, res) => {
    delete req.session.displayName;
    res.redirect('/welcome');
})

// Login
app.get('/welcome', (req, res) => {
    if (req.session.displayName) {
        res.send(`
            <h1> Hello, ${req.session.displayName}</h1>
            <a href="/auth/logout">Logout</a>`);
    }
    else {
        res.send(`
            <h1> Welcome </h1>
            <a href="/auth/login">Login</a>`);
    };
});

app.post('/auth/login', (req, res) => {
    let sampleUser = {
        username: 'TestUser',
        passwd: '1111', // Only for Test
        displayName: 'TestNickname'
    };
    let username = req.body.username,
        passwd = req.body.password;
    if (username === sampleUser.username && passwd === sampleUser.passwd) {
        req.session.displayName = sampleUser.displayName;
        res.redirect('/welcome')
    }
    else {
        res.send(`No User Found <br> <a href="/auth/login">Go To Login Page</a>`);
    }
})
app.get('/auth/login', (req, res) => {
    let output = `
        <h1>Login</h1>
        <form action="/auth/login" method="POST">
            <p>
                <input type="text" name="username" placeholder="username">
            </p>
            <p>
                <input type="password" name="password" placeholder="password">
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
    `;

    res.send(output)
});

//Session
app.get('/session', (req, res) => {
    if (req.session.count) {
        req.session.count++;
    }
    else {
        req.session.count = 1; //서버에 count값 설정
    }
    res.send('Hi Session, count =' + req.session.count);
});

//Session tmp router
app.get('/tmp', (req, res) => {
    res.send('result: ' + req.session.count);
});

//Cookie
app.get('/products', (req, res) => {
    let output = '';
    for (let p in products) {
        output += `<li>
        <a href="/cart/${p}">
            ${products[p].title}
        </a</li>`;
    }
    res.send(`<h1>Products</h1>
                <ul>${output}</ul>
                <a href="/cart"> Go to Cart </a>`);
});

/*
cart = {
    1(id):1(cnt)
    1(id):2(cnt)
    2(id):1(cnt)
}
 
*/ 
app.get('/cart', (req, res) => {
    let cart = req.signedCookies.cart;
    if (!cart) {
        res.send('Empty Cart');
    }
    else {
        let output = '';
        for (let c in cart) {
            output += `<li>${products[c].title} (개수: ${cart[c]})</li>`;
        }
        res.send(`<h1>Cart </h2>
                    <ul>${output}</ul>
                        <a href="/products">Products List</a>`);
    }
});

app.get('/cart/:id', (req, res) => {
    let id = req.params.id;
    let cart;
    if (!req.signedCookies.cart) {
        cart = {};
    } 
    else {
        cart = req.signedCookies.cart;
    }
    if (!cart[id]) {
        cart[id] = 0;
    } //아직 하나도 안 담은 경우 새로운 id가 들어올 때
    cart[id] = parseInt(cart[id]) + 1; //개수 더하기 
    res.cookie('cart', cart, {signed:true});
    res.redirect('/cart');
});

app.get('/count', (req, res) => {
    let count;
    if(req.signedCookies.count) {
        count = parseInt(req.signedCookies.count); //int화
    } //signedCookies: 암호화
    else {
        count = 0;
    }
    count = count + 1;
    res.cookie('count', count, {signed:true});
    res.send(`Count: ${count}`) //req로 온 cookie 중 count의 값
})

//parameter
app.get(['/program','/program/:prog'], (req, res) => {
    fs.readdir('data', {encoding:'utf-8'}, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
        let prog = req.params.prog;
        // prog값이 있을 때
        if (prog && prog !== 'new') {
            console.log("prog>>>", prog)
            fs.readFile('data/'+prog, {encoding: 'utf-8'}, (err, data) => {
                if(err) {
                    res.status(500).send('Internal Server Error');
                }
                res.render('program', {progs: files, title: prog, description: data});
            })
        }
        else if(prog === 'new') {
            res.render('newform')
        }
        else {
            // prog값이 없을 때
            res.render('program', {progs: files})
        };
    });
});

app.post('/program', (req, res) => {
    let title = req.body.title,
        description = req.body.description;
    fs.writeFile('data/'+title, description, (err) => {
        if(err) {
            res.status(500).send('Internal Server Error');
        }
        res.redirect('/program')

    });
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


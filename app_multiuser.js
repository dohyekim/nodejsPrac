const express = require('express');
const app = express(); //express() returns an object;
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const sha256 = require('sha256');


const port = 3000;
const options = {
    host: '127.0.0.1',
    port: 3306,
    user : 'dooo',
    password: '1234',
    database: 'session_test',
    schema: {
        tableName: 'SessionTest',
        columNames: {
            session_id: 'session_id',
            expires: 'expiredt',
            data: 'session_data'
        }
    }
};
const sessionStore = new MySQLStore(options);


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
app.use(session({
    secret: 'thYisiWs@%se5@s6Qsio^Wynsaltwow3w', 
    resave: false, 
    saveUninitialized: true,
    store: sessionStore, }));

app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ extended: false})); 
app.use(cookieParser('salt!!!!!!a0w9et2350ak3l')); 

app.set('views', './views');
app.set('view engine', 'pug'); 

if (app.get('env') === 'development') {
    app.locals.pretty = true;
}

let products = {
    1:{title: 'The history of web 1'},
    2:{title: 'The next web'},
};

//Logout
app.get('/auth/logout', (req, res) => {
    req.session.destroy( (err) => {
        res.redirect('/welcome');

    })
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


function enc(passwd, salt) {
    return sha256(passwd+salt)
};

let sampleUser = {
    username: 'TestUser',
    passwd: '9e02e269cfa207501059052f868a5291', // made through md5 hash(Not used anymore) with salt
    displayName: 'TestNickname'
};

app.post('/auth/login', (req, res) => {

    let username = req.body.username,
        passwd = req.body.password;
    if (username === sampleUser.username && md5(passwd+salt) === sampleUser.passwd) {
        req.session.displayName = sampleUser.displayName;
        req.session.save( (err) => {
            res.redirect('/welcome')
        });
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

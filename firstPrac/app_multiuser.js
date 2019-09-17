const express = require('express');
const app = express(); //express() returns an object;
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bkfd2Password = require('pbkdf2-password');

const hasher = bkfd2Password();
let opts = {
    pasword: "userPassword" 
}
// error msg, opts.password, salt, encrypted password
hasher(opts, function(err, pass, salt, hash) {
    console.log(err, pass, salt, hash)
})

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

let sampleUser = [{
    username: 'TestUser',
    passwd: 'rI773M+UXOi2RPu6iDwwgQwf8XJsN+MtMMoldnDWFPxBtKj2QXk9x+xIOQdBtr3mFJj2w+P6GE1A+2N+av0Nz5axrWVOt3Qum4r8UKM3OvcRdUIReMkMlDZ0ROfHRghwcAqubG6KQhTTgyFn7rOb61WdxRnLsTnoWJKbb9ktfjw=', // made through pbkdf2
    displayName: 'TestNickname',
    salt: 'fWgRjxDpwDH5KDYACd2wl+PCnidheQl6ce7N/b+V/2FnxIjU1clm8NtV087add7O56zHdPaXsiYF0NgilfQqxA==',
}];

app.post('/auth/login', (req, res) => {

    let username = req.body.username,
        passwd = req.body.password;
    for (let i=0; i<sampleUser.length; i++) {
        let user = sampleUser[i];
        if (username === user.username) {
            return hasher({password: passwd, salt: user.salt}, function(err, pass, salt, hash) {
                if (hash === user.passwd) {
                    // 인증성공
                    req.session.displayName = user.displayName;
                    req.session.save( (err) => {
                        res.redirect('/welcome');
                    });
                }
                else {
                    // 인증실패
                    res.send(`No User Found <br> <a href="/auth/login">Go To Login Page</a>`)
                }
            });
        }
        else {
            res.send(`ID not found. <a href="/auth/login">Go to Login</a><br>
            <a href="/auth/register">Go to Register</a>`)
        }
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


app.post('/auth/register', (req, res) => {  
    hasher({password:req.body.password}, function(err, pass, salt, hash){
        let user = {
            username: req.body.username,
            password: hash,
            salt: salt,
            displayName: req.body.displayName};
        
        sampleUser.push(user);
        req.session.displayName = user.displayName;
        req.session.save( () => {
            res.redirect('/welcome');
        });
    });
});

app.get('/auth/register', (req, res) => {
    let output = `
        <h1>Register</h1>
        <form action="/auth/register" method="POST">
            <p>
                <input type="text" name="username" placeholder="username">
            </p>
            <p>
                <input type="password" name="password" placeholder="password">
            </p>
            <p>
                <input type="text" name="displayName" placeholder="displayName">
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

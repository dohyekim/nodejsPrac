const express = require('express');
const app = express(); //express() returns an object;
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const md5 = require('md5');


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

app.post('/auth/login', (req, res) => {
    let sampleUser = {
        username: 'TestUser',
        passwd: '698d51a19d8a121ce581499d7b701668', // made through md5 hash(Not used anymore)
        displayName: 'TestNickname'
    };
    let username = req.body.username,
        passwd = req.body.password;
    if (username === sampleUser.username && md5(passwd) === sampleUser.passwd) {
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


// sessionStore.close();
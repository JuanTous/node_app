const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
http = require('http');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

const app = express();

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected correctly to server");
}, (err) => { console.log(err); });

const hostname = 'localhost';
const port = 3000;

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

const auth = (req, res, next) => {
    console.log(req.session);

    if (!req.session.user) {
        var authHeader = req.headers.authorization;
        if (!authHeader) {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');                        
            err.status = 401;
            next(err);
            return;
        }
        var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        var user = auth[0];
        var pass = auth[1];
        if (user == 'admin' && pass == 'password') {
            req.session.user = 'admin';
            next(); // authorized
        } else {
            var err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            next(err);
        }
    }
    else {
        if (req.session.user === 'admin') {
            console.log('req.session: ',req.session);
            next();
        }
        else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
}

app.use(cookieParser('12345-67890-09876-54321'));
app.use(morgan('dev'));
app.use(auth);
app.use(express.static(__dirname + '/public'));
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use(bodyParser.json());

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use((req, res, next) => {
  console.log(req.headers);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>This is an Express Server</h1></body></html>');

});

app.all('/dishes', (req,res,next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
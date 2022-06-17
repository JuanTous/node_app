const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
http = require('http');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter')
const usersRouter = require('./routes/users');
const indexRouter = require('./routes/index');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var config = require('./config');
const uploadRouter = require('./routes/uploadRouter');
const imagesRouter = require('./routes/imagesRouter');
const favoriteRouter = require('./routes/favoriteRouter');

const app = express();

// Secure traffic only
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

const url = config.mongoUrl;
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

app.use(passport.initialize());
app.use(passport.session());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(cookieParser('12345-67890-09876-54321'));
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload',uploadRouter);
app.use('/images',imagesRouter);
app.use('/favorites',favoriteRouter);
app.use('/privacy', (req, res) => {
  res.sendFile(__dirname + '/views/privacy.html');
});
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

exports.app = app;
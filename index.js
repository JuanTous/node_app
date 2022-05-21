const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
http = require('http');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderPromo')

const hostname = 'localhost';
const port = 3000;

const app = express();
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));



app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

app.use(bodyParser.json());

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
var express = require('express');
const bodyParser = require('body-parser');
var imagesRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

imagesRouter.use(bodyParser.json());

imagesRouter.route('/:imgName')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res) => {
  res.sendFile(__dirname+`/public/images/${req.params.imgName}`);
  });

module.exports = imagesRouter;
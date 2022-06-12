var express = require('express');
const bodyParser = require('body-parser');
var imagesRouter = express.Router();
const authenticate = require('../authenticate');

imagesRouter.use(bodyParser.json());

imagesRouter.route('/:imgName')
.get(authenticate.verifyUser, (req, res) => {
  res.sendFile(__dirname+`/public/images/${req.params.imgName}`);
  });

module.exports = imagesRouter;
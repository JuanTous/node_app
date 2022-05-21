const Router = require('express');
const bodyParser = require('body-parser');

const promoRouter = Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the promotions to you!');
})
.post((req, res, next) => {
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
    res.end('Deleting all promotions');
});

promoRouter.route("/:promotionid")
.get((req,res,next) => {
    res.end('Will send all the promotions with id ' + req.params.promotionid);
})
.post((req, res, next) => {
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
    res.end('Deleting all promotions');
});

module.exports = promoRouter;
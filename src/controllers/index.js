const express = require('express'),
    router = express.Router();


router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


router.options('*', function (request, response) {
    response.sendStatus(204);
});


router.use('/messages', require('./messages'));
router.use('/files', require('./file-storage'));

router.get('/', function (req, res) {
    res.render('index')
});

router.get('**', function (request, response) {
    response.render('404.pug');
});

module.exports = router;
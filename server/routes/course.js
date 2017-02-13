var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('test', {text: 'Your TODO list on the Web'});
});

module.exports = router;

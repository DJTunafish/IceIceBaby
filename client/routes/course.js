var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', {text: "ping", navOpts: [{name:"pingus", link:"AAAA"}]});
});

module.exports = router;

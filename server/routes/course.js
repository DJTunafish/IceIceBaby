var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.json( {text: 'DSsgsdgsdgd'});
});

module.exports = router;

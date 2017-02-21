var express = require('express');
var router = express.Router();

var Course = require('../models/Course.js');

/*router.get('/', function(req, res, next) {
    res.json( {text: 'DSsgsdgsdgd'});
});
*/
/*
  Given a course (gencode), return the course entry associated with it.
*/
router.get('/', function(req, res, next) {
  Course.findAll({
    where: {
      gencode: req.query.gencode
    }
  }).then(function(course) {
    res.json(course);
  });
});

module.exports = router;

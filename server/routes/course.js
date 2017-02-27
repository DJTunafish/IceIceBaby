var express = require('express');
var router = express.Router();

var Course = require('../models/Course.js');
var Quiz = require('./quiz.js');
var Group = require('../models/Group.js');
router.use('/quiz', Quiz);

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

/*
  Given a course (gencode), returns the groupconstellations in that course. Must be admin to be able to see this.
*/
router.get('/coursegroups', function(req, res, next) {
  Group.findAll({
    where: {
      course: req.query.gencode
    }
  }).then(function(course) {
    res.json(course);
  });
});




module.exports = router;

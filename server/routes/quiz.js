var express = require('express');
var router = express.Router();

var Admin = require('../models/Admin.js');
var Student = require('../models/Student.js');
var Course = require('../models/Course.js');
var Quiz = require('../models/Quiz.js');
var RegisteredAt = require('../models/RegisteredAt.js');

/*
    Given a course (gencode), returns all the questions associated with that course.
*/

router.post('/score', function(req, res, next) {
  RegisteredAt.findOne({
    where: {
      student: req.body.cid,
      course: req.body.gencode
    }
  }).then(function(old) {
    res.json(old);
    old.update({
      score: parseInt(req.body.score)
    }).then(function() {
      res.sendStatus(200);
    });
  });
});

router.get('/questions', function(req, res, next) {
  Quiz.findAll({
    where: {
      course: req.query.gencode
    }
  }).then(function(questions) {
    res.json(questions);
  });
});

module.exports = router;

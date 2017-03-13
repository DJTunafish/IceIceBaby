var express = require('express');
var router = express.Router();

var Admin = require('../models/Admin.js');
var Student = require('../models/Student.js');
var Course = require('../models/Course.js');
var Question = require('../models/Question.js');
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

/*
  Given a course (gencode), returns all the questions associated with this course, aswell as the weights and stuff.
  The idea is that the client will handle asking the questions and calculating the score, and then simply posting the result to the server.
*/
router.get('/questions', function(req, res, next) {
  Question.findAll({
    where: {
      course: req.query.gencode
    }
  }).then(function(questions) {
    res.json(questions);
  });
});

module.exports = router;

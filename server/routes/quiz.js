var express = require('express');
var router = express.Router();
var sequelize = require('../db/ice_orm.js');


var Admin = require('../models/Admin.js');
var Student = require('../models/Student.js');
var Course = require('../models/Course.js');
var Question = require('../models/Question.js');
var RegisteredAt = require('../models/RegisteredAt.js');


/*
GIven course (gencode) and cid post the score to the database
*/
router.post('/score', function(req, res, next) {
  console.log('Input gencode: '+req.body.gencode);
  console.log('Input cid: '+req.body.cid);
  RegisteredAt.findOne({
     where: {
      student: req.body.cid,
      course: req.body.gencode
    }
  }).then(function(old) {
    console.log('New Score: '+ req.body.score);
    console.log('Old score: '+ old.score);
    old.update({
      score: parseInt(req.body.score)
    }).then(function() {
        res.json({result: "success", data:old });
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
  }).then(function(questionsResponse) {
    res.json({result: "success", questions: questionsResponse});
  });
});

module.exports = router;

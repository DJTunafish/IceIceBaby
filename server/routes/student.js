var express = require('express');
var router = express.Router();

var Group = require('../models/Group.js');
var Student = require('../models/Student.js');
var isLoggedIn = require('../auth/isLoggedIn.js');
var RegisteredAt = require('../models/RegisteredAt.js');

/*
  Given a student (cid), returns all the groups this student is a member of.
*/
router.get('/groups', function(req, res, next) {
  Group.findAll({
    where: {
      student: req.query.cid
    }
  }).then(function(groups) {
    res.json(groups);
  });
});

/*
  Given a student (cid), return the profile of the user.
*/
router.get('/', function(req, res) {
    var loggedIn = isLoggedIn(req, res);
    if(loggedIn){
      Student.findOne({
        where: {
          cid: req.query.cid
        }
      }).then(function(student) {
        res.json({result: "success", student: student, token: loggedIn.token});
      });
  }
  //});
});

router.post('/join/course', function(req, res, next) {

/*
  Given a student (cid) and a course (gencode), registers the student at the course.
*/
// NOT TESTED, TEST TOMORROW
router.post('/join/course', function(req, res, next) {
  RegisteredAt.build({
    student: req.body.cid,
    course: req.body.gencode
  }).save().then(function() {
    res.sendStatus(200);
  }).catch(function(err) {
    res.sendStatus(500);
  });
});






module.exports = router;

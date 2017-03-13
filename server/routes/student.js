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
  /*
    Need for try catch here stems from the fact that isLoggedIn will throw an
    exception if the user is not logged in. We wish to report back to the client,
     not have them timeout.
  */
    try {
      var loggedIn = isLoggedIn(req, res);
    } catch(err) {
      res.json({result: "failure, user not authenticated"});
    }
    if(loggedIn){
      Student.findOne({
        where: {
          cid: req.query.cid
        }
      }).then(function(student) {
        res.json({result: "success", student: student, token: loggedIn.token});
      });
  }
});

/*
  Given a student (cid) and a course (gencode), registers the student at the course.
*/
router.post('/join/course', function(req, res, next) {
  try {
    var loggedIn = isLoggedIn(req, res);
  } catch(err) {
    res.json({result: "failure, user not authenticated"});
  }
  if(loggedIn) {
    RegisteredAt.build({
      student: req.body.cid,
      course: req.body.gencode
    }).save().then(function() {
      res.json({result: "success", token: loggedIn.token});
    }).catch(function(err) {
      res.sendStatus(500);
    });
  }
});


module.exports = router;

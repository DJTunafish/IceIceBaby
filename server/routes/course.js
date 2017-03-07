var express = require('express');
var router = express.Router();
var sequelize = require('../db/ice_orm.js');
var Sequelize = require('sequelize');
var jwt = require("jwt-simple");

var isLoggedIn = require('../auth/isLoggedIn.js');
var constants = require("../resources/constants.js");


var Course = require('../models/Course.js');
var Quiz = require('./quiz.js');
var Group = require('../models/Group.js');
var Student = require('../models/Student.js');
var RegisteredAt = require('../models/RegisteredAt.js');
var User = require('../models/User.js');
var UngroupedStudents = require('../models/UngroupedStudents.js');
var GroupMembers = require('../models/GroupMembers.js');

router.use('/quiz', Quiz);

/*
  Given a course (gencode), return the course entry associated with it.
*/
router.get('/', function(req, res, next) {
  var loggedIn = isLoggedIn(req, res);
  if(loggedIn) {
      Course.findOne({
          where: {
              gencode: req.query.gencode
          }
      }).then(function (courseResponse) {
          res.json({result: "success", course: courseResponse, token: loggedIn.token});
      });
  }
});

/*
  Given a course (gencode), returns the groupconstellations in that course. Must be admin to be able to see this.
*/
router.get('/allgroups', function(req, res, next) {
  var students = [];
  Group.findAll({
    where: {
      course: req.query.course
    }
  }).then(function(course) {
    res.json(course);
  });
});

/*
 Given a course (gencode), this route will return a list of all students in the course that are not yet part of any group.
*/
router.get('/ungrouped', function(req, res, next){
  var loggedIn = isLoggedIn(req, res);
  if(loggedIn){
    UngroupedStudents.findAll({
      where: {
        course: req.query.course
      }
    }).then(function(students) {
      res.json({result: "success", token:loggedIn.token, ungroupedStudents: students});
    });
  } else {
    res.json({result: "failure", message: "User not logged in. Please log in if you wish to view the ungrouped students for course " + req.query.course});
  }
});

/*
  Given a course (gencode) and a groupid (id), return all the members in that group.
  Each entry for a member contains
  - groupid (id)
  - course
  - cid
  - firstname
  - lastname
  - email
  - profile
*/
router.get('/group', function (req, res, next) {
  var loggedIn = isLoggedIn(req, res);
  if(loggedIn) {
    GroupMembers.findAll({
      where: {
        course: req.query.course,
        id: req.query.group
      }
    }).then(function(members) {
      res.json({result: "success", groupmembers: members});
    });
  } else {
    res.json({result: "failure", message: "User not logged in. Please log in if you wish to view the profiles of groupmembers"});
  }
});

router.post('/register', function(req, res, next){
  var loggedIn = isLoggedIn(req, res);
  if(loggedIn){
    Course.findOne({where: {gencode : req.body.gencode}}).then(function(course){
      var courseName = null;
      var message = "";
      if(course){
        var decodedToken = jwt.decode(loggedIn.token, constants.secret);
        RegisteredAt.findOne(
          {where:
            {student: decodedToken.user,
             course: req.body.gencode}})
        .then(function(registered){
          if(!registered){
            RegisteredAt.create(
              {student: decodedToken.user,
               course: req.body.gencode,
               score: 0
              });
              message = "Successfully registered to course " + req.body.gencode;
          }else{
            console.log("User already registered to course");
            message = "Already registered to course";
          }
          res.json({result: "success", token:loggedIn.token, courseName: courseName, message: message});
        });
      }else{
        message = "No such course exists";
        res.json({result: "success", token:loggedIn.token, courseName: courseName, message: message});
      }
    });
  }
});

module.exports = router;

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
 Feth all ungrouped students, for group matching purposes
*/
router.get('/ungrouped', function(req, res, next){
  //var loggedIn = isLoggedIn(req, res);
  //if(loggedIn){
  /*  Group.findAll({where : {course: req.query.course}})
    .then(function(allGroups){
      var cids = new Array();
      for(let i = 0; i < allGroups.length; i++){
        cids.push(allGroups[i].student);
      }
      RegisteredAt.findAll({where:{
        course: req.query.course,
        $not: {
          student: {
            $in: cids
          }
        }
      },
      order: 'student DESC'
      })
      .then(function(registrations){
        cids = new Array();
        for(let i= 0; i < registrations.length; i++){
          cids.push(registrations[i].student);
        }
        Student.findAll({ //TODO: SORT THE QUERY RESULTS
          where: {
            cid: {
              $in: cids
            }
          },
          order: 'cid DESC'
        }]).then(function(students){
          User.findAll({
            where: {
              cid: {
                $in: cids
              }
            },
            order: 'cid DESC'
          }).then(function(users){
            //TODO: Compile data into one array of objects
            var profiles;
            console.log("HERE COMES THE FOR");
            for(let i= 0; i < users.length; i++){
              console.log(users[i].cid);
              console.log(students[i].cid);
              console.log(registrations[i].student);
              var profile = {};
              profiles.push(profile);
            }
            res.json({result: "success", token: loggedIn.token, students: profiles});
          });
        });
      });

    });*/
//  }
});


//If someone wants to make this to work, go ahead. Supposed to get profiles in a group.
router.get('/group/meminfo', function (req, res, next) {
  //console.log("bajs bajs" + req.query.id);
  Sequelize.query("SELECT * FROM student WHERE cid IN (SELECT student FROM groups WHERE id = :id AND course = :course)",
      {model: Student}, {replacements: {id: req.query.id, course: req.query.course}}).then(function (students) {
        res.json(students);


      }).catch(function (err) {
        res.status(500).send("Y u no werk");

  });
});

router.get('/group', function(req, res, next) {
  var students = [];
  Group.findOne( {
    where: {
      id: parseInt(req.query.id),
      course: req.query.course
    }
  }).then(function(group){
    res.json(group);

    //Tried to get the profiles for students, shit don't work yo.

  /*  //through all students in the group, get them
    var i = 0;
    while(i < group.length){
      console.log(group[i].dataValues.student);
      Student.findOne({
        where: {
          cid: group[i].dataValues.student
        }
      }).then(function(student){
        students[i] = student;
        if(i === 0){
          console.log("lolol");
        }
        console.log(i);
        i++;
        //console.log(students);

      }).catch(function(err) {
        res.status(500).send("donkey dong");
      });
    }
      res.json(students);
*/
    }).catch(function(err) {
      res.status(500).send("something went wrong while getting members");
    });
  // have to look into how to make join querys. Worst case scenario we just write it out.
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
             course: req.body.gencode}}).then(function(registered){
          if(!registered){
            RegisteredAt.create(
              {student: decodedToken.user,
               course: req.body.gencode,
               score: 0
              });
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

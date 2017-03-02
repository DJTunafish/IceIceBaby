var express = require('express');
var router = express.Router();
var sequelize = require('../db/ice_orm.js');
var Sequelize = require('sequelize');

var Course = require('../models/Course.js');
var Quiz = require('./quiz.js');
var Group = require('../models/Group.js');
var Student = require('../models/Student.js');
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



module.exports = router;

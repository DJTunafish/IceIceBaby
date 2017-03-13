var express = require('express');
var router = express.Router();

var Admin = require('../models/Admin.js');
var Student = require('../models/Student.js');
var Course = require('../models/Course.js');
var isLoggedIn = require('../auth/isLoggedIn.js');
var constants = require("../resources/constants.js");

//show admin page
router.get('/', function(req, res, next) {
  Admin.findOne({
    where: {
      cid: req.query.cid
    }
  }).then(function(admin) {
    res.json(admin);
  });
});

router.get('/courses', function(req, res, next) {
    var loggedIn = isLoggedIn(req, res);
    console.log("getting courses")
    if(loggedIn) {
      console.log("getting courses")
        Course.findAll({
            where: {
                admin: req.query.cid
            }
        }).then(function (courses) {
          console.log(courses)
           res.json({result: "success", courses: courses, token: loggedIn.token});
        }).catch(function (err) {
            console.log("error when getting courses")
        });
    }
});

/*
  Given a course, coursecode, coursename, coursedescription and the cid of an admin, creates a course and
  associates that admin with the course.
*/
router.post('/createcourse', function(req, res, next){
    var loggedIn = isLoggedIn(req, res);
    if(loggedIn) {
        Course.build({
            gencode: req.body.gencode,
            coursecode: req.body.coursecode,
            name: req.body.name,
            description: req.body.description,
            admin: req.body.admin
        }).save().then(function () {
            res.json({result: "success", token: loggedIn.token});
        }).catch(function (err) {
            res.status(500).send((err + "\n"));
        });
    }
});


//removes a course with the given gencode
router.post('/removecourse', function(req, res, next) {
    var loggedIn = isLoggedIn(req, res);
    if(loggedIn) {
        Course.destroy({
            where: {
                gencode: req.body.gencode
            }
        }).then(function () {
            res.json({result: "success", token: loggedIn.token})
        }).catch(function (err) {
            res.status(500).send("error, the course didnt get removed");
        });
    }
});


module.exports = router;

var express = require('express');
var router = express.Router();
var jwt = require("jwt-simple");
var isLoggedIn = require('../auth/isLoggedIn.js');
var constants = require("../resources/constants.js");
var User = require('../models/User');
var RegisteredAt = require('../models/RegisteredAt');
var Course = require('../models/Course');


router.get("/", function(req, res, next){
  var loggedIn = isLoggedIn(req, res);
  if(loggedIn){
    User.findOne({
      where: {
        cid: req.query.cid
      }
    }).then(function(user) {
      var response = {result: "success", token: loggedIn.token,
                      user: {cid: user.cid, email : user.email,
                      firstname: user.firstname, lastname: user.lastname}};
      var decodedToken = jwt.decode(loggedIn.token, constants.secret);
      if(decodedToken.user == req.query.cid){
        response.personnumber = user.personnumber;
      }
      res.json(response);
    });
  }
});

//Should probably be under the student router if it just returns regged courses.
router.get("/courses", function(req, res, next){
  var loggedIn = isLoggedIn(req, res);
  if(loggedIn){
    RegisteredAt.findAll({
      where: {
        student: req.query.cid
      }
    }).then(function(response) {
      var courses = [];
      var i;
      for(i = 0; i < response.length; i++){
        courses.push({gencode: response[i].course});
      }
      Course.findAll({
        where: {
          $or: courses
        }
      }).then(function(coursesResponse){
        res.json({result: "success", courses: coursesResponse, token: loggedIn.token});
      });
    });
  }
});

module.exports = router;

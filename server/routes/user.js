var express = require('express');
var router = express.Router();
var jwt = require("jwt-simple");
var bcrypt   = require('bcrypt-nodejs');
var sequelize = require('../db/ice_orm.js');
var isLoggedIn = require('../auth/isLoggedIn.js');
var constants = require("../resources/constants.js");
var User = require('../models/User');
var RegisteredAt = require('../models/RegisteredAt');
var Course = require('../models/Course');
var Admin = require('../models/Admin');
var Student = require('../models/Student');
var Group = require('../models/Group.js');


router.get("/", function(req, res, next){
  var loggedIn = isLoggedIn(req, res);
  if(loggedIn){
    User.findOne({
      where: {
        cid: req.query.cid
      }
    }).then(function(user) {
      Admin.findOne({
        where: {
          cid: req.query.cid
        }
      }).then(function(admin){
        console.log("is an admin");
        var response = {result: "success",
            token: loggedIn.token,
            user: {
                cid: user.cid,
                email : user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                isAdmin: true
                }
            };
        var decodedToken = jwt.decode(loggedIn.token, constants.secret);
        if(decodedToken.user == req.query.cid){
          response.personnumber = user.personnumber;
        }
        res.json(response);
      });
    });
  }
});

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
//TODO: Assumes that given user is in at least one group
router.get('/groups', function(req, res, next){
  var loggedIn = isLoggedIn(req, res);
  if(loggedIn){
    var decodedToken = jwt.decode(loggedIn.token, constants.secret);
    Group.findAll({where: {
      student: decodedToken.user
    }}).then(function(studentGroups){
      var queryQualifiers="";
      for(let i = 0; i < studentGroups.length; i++){
        if(i != 0){
          queryQualifiers = queryQualifiers + " OR ";
        }
        queryQualifiers = queryQualifiers + " (id=" + studentGroups[i].id +
        " AND course=\'" + studentGroups[i].course + "\' )";
      }
      sequelize.query("SELECT * FROM GroupMembers WHERE" + queryQualifiers +
      " ORDER BY course DESC", { type: sequelize.QueryTypes.SELECT})
      .then(function(members) {
        var groups = new Array();
        for(let j= 0; j < members.length; j++){
          if(j == 0 || members[j].course != groups[groups.length - 1].course){
            groups.push({course: members[j].course,
                         id: members[j].id,
                         members: [{
                           cid: members[j].cid,
                           firstname: members[j].firstname,
                           lastname: members[j].lastname,
                           email: members[j].email,
                           profile: members[j].profile
                         }]});
          }else{
            groups[groups.length - 1].members.push({
              cid: members[j].cid,
              firstname: members[j].firstname,
              lastname: members[j].lastname,
              email: members[j].email,
              profile: members[j].profile
            });
          }
        }
        res.json({result: "success", token: loggedIn.token, groups: groups});
      });
    });
  }
});

router.post("/", function(req, res, next){
  var loggedIn = isLoggedIn(req, res);
  if(loggedIn){
    var decodedToken = jwt.decode(loggedIn.token, constants.secret);
    var nPass;
    var nProf;
    var nEmail;

    Student.findOne({where: {cid: decodedToken.user}}).then(function(oldStudent){
      User.findOne({where: {cid: decodedToken.user}}).then(function(oldUser){
          if(req.body.email != ""){
            nEmail = req.body.email;
          }else{
            nEmail = oldUser.email;
          }
          if(req.body.profile != ""){
            nProf = req.body.profile;
          }else{
            nProf = oldStudent.profile;
          }

          if(req.body.password != ""){
            nPass = bcrypt.hashSync(decodedToken.user + req.body.password, bcrypt.genSaltSync(8), null);
          }else{
            nPass = oldUser.password;
          }

          oldStudent.update({profile: nProf});
          oldUser.update({password: nPass, email: nEmail});

          res.json({result: "success", token: loggedIn.token});
      });
    });
  }
});

module.exports = router;

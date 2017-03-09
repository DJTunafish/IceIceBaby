var express = require('express');
var router = express.Router();

var isLoggedIn = require('../auth/isLoggedIn.js');
var jwt = require('jwt-simple');
var constants = require("../resources/constants.js");

var Group = require('../models/Group.js');
var RegisteredAt = require('../models/RegisteredAt.js');
var GroupInvite = require('../models/GroupInvite.js');

router.get('/', function(req, res, next) {
  var loggedIn = isLoggedIn(req, res);
  var decodedToken = jwt.decode(loggedIn.token, constants.secret);
  if(loggedIn){
    RegisteredAt.findOne(
      {where: {student: decodedToken.user,
               course: req.query.course}})
    .then(function(registered){
      if(registered){
        Group.findAll(
          {where: {course: req.query.course}})
        .then(function(groups){
          var returnGroups = new Array();
          for(let i = 0; i < groups.length; i++){
            if(returnGroups[groups[i].id]){
              returnGroups[groups[i].id].members.push(groups[i].student);
            }else{
              returnGroups[groups[i].id] =
                {number: groups[i].id, members: new Array(groups[i].student)};
            }
          }
          res.json({result: "success", groups: returnGroups, token: loggedIn.token});
        });
      }else{
        res.json({result: "success", message: "Not registered to course", token:loggedIn.token});
      }
    });
  }
});

/*
  Given a student (cid), course (gencode) and a group-id (id), enlists a student in a group.
  Returns 200 if successful, else 500.
*/ //TODO: Check that user isn't already member of group in given course
   //TODO: Delete group invites for user joining group?
router.post('/join', function(req, res, next) {
  var loggedIn = isLoggedIn(req, res);
  if(loggedIn){
    if(req.body.id){
      console.log("Joining existing group");
      Group.findOne({where: {
        student: req.body.student,
        course: req.body.course
      }}).then(function(result){
        if(!result){
          Group.build({
            id: parseInt(req.body.id),
            student: req.body.student,
            course: req.body.course
          }).save().then(function() {
            res.json({result: "success", token: loggedIn.token});
          }).catch(function(err) {
            res.status(500).send((err + "\n"));
          });
        }else{
          res.status(403).send("Forbidden to join group before exiting current group");
        }
      });
    }else{
      Group.findOne().then(function(result){
        if(!result){
          Group.max('id',
            {where: {course: req.body.course}})
          .then(function(maxId){
            Group.build({
              id: maxId + 1,
              student: req.body.student,
              course: req.body.course
            }).save().then(function() {
              res.json({result: "success", token: loggedIn.token});
            }).catch(function(err) {
              res.status(500).send((err + "\n"));
            });
          });
        }else{
          res.status(403).send("Forbidden to join group before exiting current group");
        }
      });


    }

  }
});

/*
  Should this be here? I think it should be somewhere in /course/group/members or possible /student/course/group/members
*/
router.get('/members', function(req, res, next) {
  // have to look into how to make join querys. Worst case scenario we just write it out.
});

router.get('/invite', function(req, res, next){
  console.log("THE DANK");
  var loggedIn = isLoggedIn(req, res);
  console.log("THE STANK");
  if(loggedIn){
    console.log("Got into if-case");
    var decodedToken = jwt.decode(loggedIn.token, constants.secret);
    GroupInvite.findAll({where:{
      receiver: decodedToken.user
    }}).then(function(invites){
      console.log("Call to groupinvite returned; " + invites);
      res.json({result: 'success', invites: invites, token:loggedIn.token});
    });
  }
});
/*
  Given a student (cid), course (gencode) and a group-id (id), de-lists a student from a group.
  Returns 200 upon successful de-listment, otherwise 500.
*/
router.post('/leave', function(req, res, next) {
  var loggedIn = isLoggedIn(req, res);
  if(loggedIn){
    Group.destroy({
      where: {
        id: parseInt(req.body.id),
        student: req.body.student,
        course: req.body.course
      }
    }).then(function() {
      res.json({result: "success", token: loggedIn.token});
    }).catch(function(err) {
      res.status(500).send("something went wrong while leaving the group");
    });
  }

});

router.post('/invite', function(req, res, next){
  var loggedIn = isLoggedIn(req, res);
  if(loggedIn){
    var decodedToken = jwt.decode(loggedIn.token, constants.secret);
    GroupInvite.findOne({where: {
      course: req.body.course,
      sender: decodedToken.user,
      receiver: req.body.receiver
    }}).then(function(previousInvite){
      if(!previousInvite){
        GroupInvite.create({
          course: req.body.course,
          sender: decodedToken.user,
          receiver: req.body.receiver}).then(function(){
          res.json({result: "success", message: "Successfully sent invite", token: loggedIn.token});
        });
      }else{
        res.json({result: "success", message: "Invite already sent to this user", token: loggedIn.token});
      }
    });
  }
});

router.put('/invite', function(req, res, next){
  console.log("PUT DA INVITE ON DE LEFT HAND SIDE");
  var loggedIn = isLoggedIn(req, res);
  if(loggedIn){
    var decodedToken = jwt.decode(loggedIn.token, constants.secret);
    GroupInvite.findOne().then(function(invite){
      if(invite){
        GroupInvite.destroy({where:
          {$or:
            [{$or:
              [
               {$and: [{course: req.body.course}, {receiver: decodedToken.user}]},
               {$and: [{course: req.body.course}, {sender: decodedToken.user}]}
              ]
            },
            {$or:
             [
               {$and: [{course: req.body.course}, {receiver: req.body.sender}]},
               {$and: [{course: req.body.course}, {sender: req.body.sender}]}
             ]}
        ] }});
        Group.max('id',
          {where: {course: req.body.course}})
        .then(function(maxId){
          var groupNo = maxId + 1;
          Group.build({
            id: groupNo,
            student: decodedToken.user,
            course: req.body.course
          }).save().then(function() {
            Group.build({
              id: groupNo,
              student: req.body.sender,
              course: req.body.course
            }).save().then(function(){
              res.json({result: "success", token: loggedIn.token});
            });
          }).catch(function(err) {
            res.status(500).send((err + "\n"));
          });
        });
      }else{
        res.status(404).send(("No such invite found"));
      }
    });
  }
});

module.exports = router;

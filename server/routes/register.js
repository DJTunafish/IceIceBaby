var express = require('express');
var router = express.Router();
var bcrypt   = require('bcrypt-nodejs');

var User    = require('../models/User.js');
var Student = require('../models/Student.js');

router.post('/', function(req, res) {
  console.log("Request for: " + req.body.cid + " with personnumber " + req.body.personnumber);
  User.findAll({
    where: {
      cid: req.body.cid
    }
  }).then(function(students) {
    if(students.length > 0){
      res.json({result: "fail"});
    }else{
      User.build({
        cid: req.body.cid,
        email: req.body.email,
        personnumber: req.body.personnumber,
        password: bcrypt.hashSync(req.body.cid + req.body.password, bcrypt.genSaltSync(8), null),
        firstname: req.body.firstname,
        lastname: req.body.lastname
      }).save().then(function(){
            Student.build({cid: req.body.cid, profile: "Empty"
          }).save().then(function(){
              res.json({result: "success"});
          });
      }).catch(function(err) {
        console.log(err);
        res.sendStatus(500);
      });
    }
  }).catch(function(err) {
    console.log("Ran into an unspecified error while checking if user " + req.body.cid + " already exists");
    res.sendStatus(500);
  });


});

module.exports = router;

var express = require('express');
var router = express.Router();
var bcrypt   = require('bcrypt-nodejs');

var User    = require('../models/User.js');
var Student = require('../models/Student.js');

router.post('/', function(req, res) {
  console.log("Request for: " + req.body.cid);
  User.findAll({
    where: {
      cid: req.body.cid
    }
  }).then(function(students) {
    if(students.length > 0){
      res.json({result: "fail"});
    }else{
      User.create({cid: req.body.cid, email: req.body.email, personnumber: req.body.personnumber,
                   password: bcrypt.hashSync(req.body.cid + req.body.password, bcrypt.genSaltSync(8), null),
                   firstname: req.body.firstname, lastname: req.body.lastname, }).
        then(function(){
          Student.create({cid: req.body.cid, profile: "Empty"}).then(function(){
            res.json({result: "success"});
          });
      });
    }
  });
  

});

module.exports = router;

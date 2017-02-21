var express = require('express');
var router = express.Router();

var Group = require('../models/Group.js');
var Student = require('../models/Student.js');

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
router.get('/', function(req, res, next) {
  Student.findOne({
    where: {
      cid: req.query.cid
    }
  }).then(function(student) {
    res.json(student);
  });
});






module.exports = router;

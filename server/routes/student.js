var express = require('express');
var router = express.Router();

var Group = require('../models/Group.js');
var Student = require('../models/Student.js');

/*
  Given a student (cid), returns all the groups this student is a member of.
*/
router.get('/groups/:cid', function(req, res, next) {
  Group.findAll({
    where: {
      student: req.params.cid
    }
  }).then(function(groups) {
    res.json(groups);
  });
});

/*
  Given a student (cid), return the profile of the user.
*/
router.get('/:cid', function(req, res, next) {
  Student.findAll({
    where: {
      cid: req.params.cid
    }
  }).then(function(student) {
    res.json(student);
  });
});






module.exports = router;

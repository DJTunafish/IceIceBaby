var express = require('express');
var router = express.Router();

var Group = require('../models/Group.js');

router.get('/', function(req, res, next) {
  res.json({text: "hi"});
});

router.post('/join', function(req, res, next) {
  Group.build({
    id: parseInt(req.body.id),
    student: req.body.student,
    course: req.body.course
  }).save().then(function() {
    res.json('asdsdfdfgdfgs');//status(201);
  }).catch(function(err) {
    res.status(500).send((err + "\n"));
  });
});

module.exports = router;

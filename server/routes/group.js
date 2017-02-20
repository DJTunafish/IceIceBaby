var express = require('express');
var router = express.Router();

var Group = require('../models/Group.js');

router.get('/', function(req, res, next) {
  res.json({text: "hi"});
});

router.post('/join', function(req, res, next) {
  Group.build({
    id: 1,
    student: req.body.cid,
    course: req.body.gencode
  }).save().then(function() {
    res.status(201);
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

module.exports = router;

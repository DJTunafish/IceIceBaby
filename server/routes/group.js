var express = require('express');
var router = express.Router();

var Group = require('../models/Group.js');

router.get('/', function(req, res, next) {
  res.json({text: "hi"});
});

router.post('/join', function(req, res, next) {
  Group.build({
    student: req.body.cid,
    course: req.body.gencode,
    score: (req.body.score == "undefined" ? -1 : req.body.score)
  }).save().then(function() {
    res.status(201);
  }).catch(function(err) {
    res.status(500).send("error joining group");
  });
});

module.exports = router;

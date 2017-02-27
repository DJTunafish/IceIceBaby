var express = require('express');
var router = express.Router();

var Group = require('../models/Group.js');

router.get('/', function(req, res, next) {
  res.json({text: "hi"});
});

/*
  Given a student (cid), course (gencode) and a group-id (id), enlists a student in a group.
  Returns 200 if successful, else 500.
*/
router.post('/join', function(req, res, next) {
  Group.build({
    id: parseInt(req.body.id),
    student: req.body.student,
    course: req.body.course
  }).save().then(function() {
    res.sendStatus(200);
  }).catch(function(err) {
    res.status(500).send((err + "\n"));
  });
});

/*
  Should this be here? I think it should be somewhere in /course/group/members or possible /student/course/group/members
*/
router.get('/members', function(req, res, next) {
  // have to look into how to make join querys. Worst case scenario we just write it out.
});

/*
  Given a student (cid), course (gencode) and a group-id (id), de-lists a student from a group.
  Returns 200 upon successful de-listment, otherwise 500.
*/
router.post('/leave', function(req, res, next) {
  Group.destroy({
    where: {
      id: parseInt(req.body.id),
      student: req.body.student,
      course: req.body.course
    }
  }).then(function() {
    res.status(200).send("deleted properly");
  }).catch(function(err) {
    res.status(500).send("something went wrong while leaving the group");
  });
});

module.exports = router;

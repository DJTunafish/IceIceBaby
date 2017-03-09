var express = require('express');
var router = express.Router();

var Admin = require('../models/Admin.js');
var Student = require('../models/Student.js');
var Course = require('../models/Course.js');


//test
router.get('/test', function(req, res, next){
  res.json({text: "lollolollolol"});
});

//show admin page
router.get('/', function(req, res, next) {
  Admin.findOne({
    where: {
      cid: req.query.cid
    }
  }).then(function(admin) {
    res.json(admin);
  });
});

router.post('/createcourse', function(req, res, next){
  Course.build({
    gencode: req.body.gencode,
    coursecode: req.body.coursecode,
    name: req.body.name,
    description: req.body.description,
    admin: req.body.admin
  }).save().then(function() {
    res.sendStatus(200);
  }).catch(function(err) {
    res.status(500).send((err + "\n"));
  });
});

//removes a course with the given gencode
router.post('/removecourse', function(req, res, next) {
  Course.destroy({
    where: {
      gencode: req.body.gencode
    }
  }).then(function() {
    res.status(200).send("removed properly");
  }).catch(function(err) {
    res.status(500).send("error, the course didnt get removed");
  });
});


module.exports = router;

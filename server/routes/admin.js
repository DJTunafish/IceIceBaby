var express = require('express');
var router = express.Router();

var Admin = require('../models/Admin.js');
var Student = require('../models/Student.js');
var Course = require('../models/Course.js');


//show admin page

router.get('/test', function(req, res, next){
  res.json({text: "lollolollolol"});
});

router.get('/', function(req, res, next) {
  Admin.findOne({
    where: {
      cid: req.query.cid
    }
  }).then(function(admin) {
    res.json(admin);
  });
});


module.exports = router;

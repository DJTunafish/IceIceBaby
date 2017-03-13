var express = require('express');
var router = express.Router();
var passport = require('../auth/authStrats.js');
var bcrypt   = require('bcrypt-nodejs');
var randtoken = require('rand-token');
var Admin = require('../models/Admin');
var User    = require('../models/User.js');
var jwt = require("jwt-simple");
var constants = require("../resources/constants.js");

router.post('/', function(req, res, next) {
  passport.authenticate('login', function(err, cid, info) {
    if(cid){
      var exp = new Date();
      exp = new Date(exp.getTime() + 15*60000);
      var adminSet = false;
      var payload = {user: cid, admin: false, expires: exp.getTime()};
      Admin.findOne({where: {
        cid : cid}
      }).then(function(admin){
            if(admin){
              adminSet = true;
            }
        res.json({result: "success", isadmin: adminSet, token: jwt.encode(payload, constants.secret),
                  cid: cid});
      });
    }else{
      res.json({result: "failure row 42 in login.js"});
    }
  })(req, res, next);
});

module.exports = router;

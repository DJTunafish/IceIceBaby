var express = require('express');
var router = express.Router();
var passport = require('../auth/authStrats.js');
var bcrypt   = require('bcrypt-nodejs');
var randtoken = require('rand-token');
var Admin = require('../models/Admin');
var User    = require('../models/User.js');
var jwt = require("jwt-simple");
var constants = require("../resources/constants.js");

/*router.post('/',
  passport.authenticate('login', { failWithError: true }),
  function(req, res, next) {
    // handle success
    return res.json({result: "success"}); //TODO TODO TODO: Check if user is in Admin table, include information about this in json
  },
  function(err, req, res, next) {
    // handle error
    return res.json({result: "failure"});
  }
);*/



router.post('/', function(req, res, next) {
  passport.authenticate('login', function(err, cid, info) {
    if(cid){
      //TODO: Return info whether user is admin or not
      //TODO: Test expiration, after view using token shit is done
//      var token = randtoken.generate(16);
      var exp = new Date();
      exp = new Date(exp.getTime() + 15*60000);
      var payload = {user: cid, admin: false, expires: exp.getTime()};
      Admin.findOne({where: {cid : cid}}).then(function(admin){
        if(admin){
          payload.admin = true;
        }
        res.json({result: "success", token: jwt.encode(payload, constants.secret),
                  cid: cid});
      });
    }else{
      res.json({result: "failure"});
    }
  })(req, res, next);
});


module.exports = router;

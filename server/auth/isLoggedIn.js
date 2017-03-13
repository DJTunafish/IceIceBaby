var passport = require('../auth/authStrats.js');
var jwt = require("jwt-simple");
var constants = require("../resources/constants.js");

var exp =
  function isLoggedIn(req, res){
      var token = req.get("Authorization");
      //TODO: Crash when faulty token given. Does this need to be fixed?
      token = jwt.decode(token, constants.secret);
      if(token.expires > new Date().getTime()){
        console.log("Valid token");
        token.expires = new Date(new Date().getTime() + 15*60000).getTime();
        return {token: jwt.encode(token, constants.secret)};
      }else{
        console.log("Expired token");
        res.json({result: "failure", message: "Session expired"});
        return false;
      }
  }

module.exports = exp;

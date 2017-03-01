var passport = require('../auth/authStrats.js');
var jwt = require("jwt-simple");
var constants = require("../resources/constants.js");

var exp =
  function isLoggedIn(req, res){
      console.log("isLoggedIn");
      var token = req.get("Authorization");
      console.log("Coded: " + token);
      //TODO: Crash when faulty token given. Does this need to be fixed?
    //  console.log("Decoded: " + jwt.decode("afljflsdlfsdlfdsl", constants.secret));
      token = jwt.decode(token, constants.secret);
      if(token.expires > new Date().getTime()){
        console.log("Valid token");
        console.log("Original expires: " + token.expires);
        token.expires = new Date(new Date().getTime() + 15*60000).getTime();
        console.log("New expires: " + token.expires);
        return {token: jwt.encode(token, constants.secret)};
      }else{
        console.log("Expired token");
        res.json({result: "failure", message: "Session expired"});
        return false;
      }
  }

module.exports = exp;

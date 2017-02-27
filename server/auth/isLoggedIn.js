var passport = require('../auth/authStrats.js');
var jwt = require("jwt-simple");
var constants = require("../resources/constants.js");

var exp =
  function isLoggedIn(req, res){
      console.log("isLoggedIn");
      var token = req.get("Authorization")
      console.log("Coded: " + token);
      //TODO: Crash when faulty token given. Does this need to be fixed?
    //  console.log("Decoded: " + jwt.decode("afljflsdlfsdlfdsl", constants.secret));
      token = jwt.decode(token, constants.secret);
      console.log("Token.expires: " + token.expires);
      //console.log("Token getTime: " + token.expires.getTime());
      if(token.expires > new Date().getTime()){
        console.log("IN DA BIG IF");
        token.expires = new Date();
        console.log("WHAFA");
        token.expires = new Date(token.expires + 15*60000);
        console.log("HEYYHEYY");
        return {token: jwt.encode(token, constants.secret)};
      }else{
        console.log("SHOULDN'T BE here");
        res.json({result: "failure", message: "Session expired"});
        return false;
      }
  }

module.exports = exp;

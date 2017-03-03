var User = require('../models/User');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt   = require('bcrypt-nodejs');
var randtoken = require('rand-token');


passport.serializeUser(function(user, done) { //TODO
  console.log("AUTH: serializeUser");
  done(null, user.id);
});

passport.deserializeUser(function(id, done) { //TODO
  console.log("AUTH: deserializeUser");
  User.find({where: {id: id}}).success(function(user){
    done(null, user);
  }).error(function(err){
    done(err, null);
  });
});

passport.use('signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'cid',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
  function(req, cid, password, done) {
    User.find({ where: { cid: cid }}).success(function(user) {
      if (!user) {
         var passHash = bcrypt.hashSync(cid + password, bcrypt.genSaltSync(8), null);
         var newUser = User.create({cid: cid, personnumber: req.body.personnumber,
                                    email: req.body.email, firstname: req.body.firstname,
                                    lastname: req.body.lastname, password: passHash});
         done(null, user);
      } else {
        done(null, false, { message: 'User already exists' }); //TODO Error
      }
    }).error(function(err){
      done(err);
    });
  }
));

passport.use('login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'cid',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
  function(req, cid, password, done) {
    console.log("Login auth strategy");
    User.findOne({
      where: { cid : cid }
    }).then(function(user) {
      if (!user) {
        done(null, false, { message: 'Unknown user' });
        console.log("USER DOES NOT EXIST");
      } else if (!(bcrypt.compareSync(cid + password, user.password))) {
        done(null, false, { message: 'Invalid password'});
        console.log("PASSWORD INCORRECT: " + user.password + " given was: " + password);
      } else {
        console.log("EVERYTHING FINE");
        done(null, cid);
      }
    }).error(function(err){
      done(err);
    });
  }
));

passport.use('verifyToken', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'cid',
        passwordField : 'token',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    }, function(req, cid, token, done){
      //TODO: Remember to update expiration time of token if it exists
      AuthToken.findOne({where: {user: cid}}).then(function(authtok){
        console.log("verifytoken");
        if(!authtok){
          done(null, false, {message: 'Not logged in'});
        }else if(!(bcrypt.compareSync(token, authtok.token))){ //If given token doesn't match
          done(null, false, {message: 'Token does not match'});
        }else if((new Date()) > authtok.expires){ //If token is expired
          done(null, false, {message: 'Login timed out'});
        }else{ // Everything's fine, update expiration time
          authtok.update({expires : new Date(new Date().getTime() + 15*60000)})
          .then(function(){
            done(null, cid);
          });
        }
      });

    }));


module.exports = passport;

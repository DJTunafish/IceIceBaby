var User = require('../models/User');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt   = require('bcrypt-nodejs');
var randtoken = require('rand-token');


passport.serializeUser(function(user, done) { //TODO
  done(null, user.id);
});

passport.deserializeUser(function(id, done) { //TODO
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
    User.findOne({ where: { cid : cid }}).then(function(user) {
      if (!user) {
        done(null, false, { message: 'Unknown user' });
        console.log("User does not exist");
      } else if (!(bcrypt.compareSync(cid + password, user.password))) {
        done(null, false, { message: 'Invalid password'});
        console.log("Password incorrect");
      } else {
        console.log("Everything fine");
        done(null, cid);
      }
    }).error(function(err){
      done(err);
    });
  }
));

module.exports = passport;

var auth = require("./../config/auth");

var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var user_controller = require('./../controllers/user_controller');
var router = express.Router();

// define user
var user = require('./../models/user');
const User = mongoose.model('user');

/* GET users listing. */
router.post('/register', (req, res) => {
  let errors = [];

  if(req.body.password !== req.body.password1){
    errors.push({text:'Passwords do not match'});
  }

  if(req.body.password.length < 8){
    errors.push({text:'Password must be at least 8 characters'});
  }

  if(errors.length > 0){
    res.render('register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      BOD: req.body.BOD,
      username: req.body.username,
      password: req.body.password,
      password1: req.body.password1
    });
  } else {
    User.findOne( { $or : [ {email: req.body.email}, {username: req.body.username} ] })
        .then(user => {
          if(user){
            console.log("Error");
            req.flash('error_msg', 'Username or Email already registered');
            res.redirect('register');
          } else {
            const newUser = new User({
              name: req.body.name,
              username: req.body.username,
              email: req.body.email,
              password: req.body.password,
              BOD: req.body.BOD
            });

            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                user_controller.register(newUser.username, newUser.email,newUser.name,newUser.password,newUser.BOD,
                    function (error, result) {
                  if (error){
                    console.log(err)
                    return;
                  }
                  passport.authenticate('local')(req, res, function () {
                    res.render('users');
                  })

                });
              });
            });
          }
        });
  }
});


// to view register form
router.get('/register',function (req,res,next) {
  res.render('register')
});
module.exports = router;

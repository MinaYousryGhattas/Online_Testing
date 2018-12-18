var auth = require("./../config/auth");

var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var user_controller = require('./../controllers/user_controller');
var router = express.Router();
var fs = require("fs");
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
            req.flash('error_message', 'Username or Email already registered');
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
                    req.flash("success_message");
                    res.render('user');
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

router.get('/login', function (req, res) {
  res.render('login')
});

router.post('/login', (req, res) => {
  // form validation
  errors = [];
  if (req.body.password <= 8){
    errors.push("Password must be greater than 8 characters");
  }
  if (req.body.username.length <=0){
    errors.push("username is required");
  }
  if (errors.length > 0){
    res.render('login',{
      errors: errors,
      username: req.body.username,
      password: req.body.password
    });
  }
  else {
    passport.authenticate('local', {
      successRedirect: (req.session.returnTo || 'user'),
      failureRedirect: '/users/login',
      failureFlash: true
    }) (req, res, function(){
      req.flash("success_message");
      res.redirect('/users/user');
    });
  }



});

router.get("/user", function (req, res) {
  res.render('user')
});

router.get("/logout",function (req,res) {
  req.logout();
  req.flash('success_message','logged out');
  res.redirect('/users/login');
});


router.get('/view_cv', function(req, res){
  // var tempFile='H:\\courses\\Fourth\\FT\\IA\\Project\\Online_Testing\\public\\Lecture _02-a.pdf';
  // fs.readFile(tempFile, function (err,data){
  //   response.contentType("application/pdf");
  //   response.send(data);
  // });
  res.render('viewcv');
});


router.get('/name', function(req, res){
  var tempFile='H:\\courses\\Fourth\\FT\\IA\\Project\\Online_Testing\\public\\1.pdf';
  fs.readFile(tempFile, function (err,data){
    res.contentType("application/pdf");
    res.send(data);
  });
});

module.exports = router;

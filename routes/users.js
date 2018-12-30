var auth = require("./../config/auth");
var email_controller=require("./../controllers/email_controller");
var exam_controller=require("./../controllers/exam_controller");
var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var user_controller = require('./../controllers/user_controller');
var router = express.Router();
var fs = require("fs");
var job = require('./../models/job');
var Job = mongoose.model('job');
// define user
var user = require('./../models/user');
const User = mongoose.model('user');
// check auth..
var {ensureAuthenticated} = require('./../config/auth');
// upload cv config....
var multer = require('multer');
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/cvs')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname+ '-' + Date.now()+'.pdf');
  }
});
var upload_cv = multer({storage: storage});


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
              BOD: req.body.BOD,

            });
            if(req.body.Hr){
              newUser.ishr="yes";
            }
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                user_controller.register(newUser.username, newUser.email,newUser.name,newUser.password,newUser.BOD,newUser.ishr,
                    function (error, result) {
                  if (error){
                    console.log(err)
                    return;
                  }
                  passport.authenticate('local')(req, res, function () {
                    req.flash("success_message");
                    console.log(req.user.ishr);
                    if(newUser.ishr=="yes")
                      res.render('hr');
                    else
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
  if (req.body.password < 8){
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
      successRedirect: (req.session.returnTo  ),
      failureRedirect: '/users/login',
      failureFlash: true
    }) (req, res, function(){
      req.flash("success_message");
      if(req.user.ishr==="yes")
      {
        req.flash("ishr");
        res.redirect('/users/hr');
      }
      else
        res.redirect('/users/user');
    });
  }



});

router.get("/user", ensureAuthenticated, function (req, res) {
  res.render('user');
});
router.get("/hr", ensureAuthenticated, function (req, res) {
  res.render('hr');
});

router.get("/logout",function (req,res) {
  req.logout();
  req.flash('success_message','logged out');
  res.redirect('/users/login');
});


router.get('/view_cv', ensureAuthenticated,function(req, res){
  res.render('viewcv');
});


router.get('/get_cv_data', ensureAuthenticated, function(req, res){
  var tempFile=req.user.cv_path;
  fs.readFile(tempFile, function (err,data){
    res.contentType("application/pdf");
    res.send(data);
  });
});


router.post('/upload_cv', ensureAuthenticated, upload_cv.single('cv'), (req,res,next)=>{
    User.findOne({username: req.user.username}).then(user =>{
      user.cv_path = (req.file.path).substr(7);
      user.save().then(user =>{
        req.flash('success_message', 'CV uploaded');
        res.redirect('/users/user');})
    });
});

router.get('/approve/:id', function(req, res, next) {

  Job.updateOne({"applicants._id":req.params.id},{$set: {
      "applicants.$.status" : true}}
      ).then(

    res.redirect('/')
    );
});
router.get('/disapprove/:id', function(req, res, next) {

  Job.updateOne({"applicants._id":req.params.id},{$pull:
            {applicants: {_id: req.params.id}}}
  ).then(

      res.redirect('/')
  );
});
router.get('/exams/:user/:job',function (req, res) {
  res.render('exam',{
      job:req.params.job,
      userid:req.params.user

    });
});
router.post('/exams/:user/:j',function (req, res) {
  //console.log(req.params.id+" "+req.params.user);
  var exams=[];
  if(req.body.java){
    exams.push("java");
  }
  if(req.body.IQ){
    exams.push("Iq");
  }
  if(req.body.Python){
    exams.push("python");
  }
  if(req.body.English){
    exams.push("english");
  }
  User.findOne({_id:req.params.user}).then(async user => {
    console.log("!", user.email);

    if (user) {
      var job = await Job.findOne({"applicants._id": req.params.j});
      var links = await exam_controller.getExamsLinks(exams, job._id);
      //console.log("links = ", links, "email = ", user.email);
      email_controller.send_exams_to_candidate(links, user);
    }
    res.redirect('/');
  });

});
module.exports = router;

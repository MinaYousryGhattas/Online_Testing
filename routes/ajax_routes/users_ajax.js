var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var router = express.Router();

var user = require('./../../models/user');
const User = mongoose.model('user');

router.get('/check_username',(req,res)=> {
    User.findOne({username:req.query.username})
        .then(user=>{
            if (user){
                res.send(false);
            }else{
                res.send(true);
            }
        });
});
router.get('/check_email',(req,res)=> {
    User.findOne({email : req.query.email})
        .then(user=> {
            if (user) {
                res.send(false);
            } else {
                res.send(true);
            }
        });
});

module.exports = router;


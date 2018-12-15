var express = require('express');
var user_controller = require('./../controllers/user_controller');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    user_controller.add_user(req.body['username'],req.body['email'],req.body['phone_number'],req.body['address_name'],req.body['password'],function (err, result) {
        if (result){
            res.render('users')
        }
        else{
            res.render('register')
        }
    })
});

// to view register form
router.get('/',function (req,res,next) {
    res.render('register')
});
module.exports = router;

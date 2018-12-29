const LocalStrategy  = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
var user = require('./../models/user');
const User = mongoose.model('user');



module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField: 'username'}, (username, password, done) => {
        // Match user
        User.findOne({$or : [{username:username},{email:username}]}
        ).then(user => {
            if(!user){
                return done(null, false, {message: 'Username Or Password not Found'});
            }

            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){

                    return done(null, user);

                } else {
                    return done(null, false, {message: 'Username Or Password not Found'});
                }
            })
        })
    }));
    passport.use('hr',new LocalStrategy(function (name,password,done){

        }

    ));
    passport.serializeUser(function(user, done) {

        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

}


// requires
const mongoose = require('mongoose');
var user = require('./../models/user');
//
const User = mongoose.model('user');

module.exports = {
    register: function (username, email, name, password, bod, Ishr,callback) {
        const new_user = new User({
            username: username,
            email: email,
            name: name,
            password: password,
            BOD: bod,
            ishr:Ishr
        });
        new_user.save().then(user=> {
                callback(null, user)
            }
        ).catch(err => {
                callback(err, null)
            }
        )
    }

};




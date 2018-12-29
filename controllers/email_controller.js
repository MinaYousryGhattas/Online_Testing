// var address_controller = require('./address_controller')
var nodemailer = require('nodemailer');


module.exports = {
    // email_data structure should be like that
    // email_data : {subject : '....'
    // ,body : '.....'
    send_email: function (email, password, _to, email_data, callback) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: password
            }
        });


        var mailOptions = {
            from: email,
            to: _to,
            subject: email_data.subject,
            text: email_data.body
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                callback(error, 'e-Mail is failed to send');
            } else {
                callback(null, info);
            }
        });
    }
};
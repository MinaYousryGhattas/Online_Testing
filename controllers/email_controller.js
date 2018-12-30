// var address_controller = require('./address_controller')
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var user = require('./../models/user');
const User = mongoose.model('user');

module.exports = {
    // email_data structure should be like that
    // email_data : {subject : '....'
    // ,body : '.....'
    send_email: function ( _to, email_data, callback) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'onlinetestingserver@gmail.com',
                pass: 'online12345678'
            }
        });


        var mailOptions = {
            from: 'onlinetestingserver@gmail.com',
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
    },

    send_exam_result_to_hr_and_candidate: async function (exam, callback) {
        var subject = exam.candidate.username + ' candidate exam result';
        var body = "Candidate: " + exam.candidate.username + "\n " +
            "with Email: " + exam.candidate.email + "\n " +
            "has solved Exam: " + exam.exam_type.type_name + "\n " +
            "Exam ID:" + exam._id + "\n " +
            "Score: " + exam.score + " out of " + exam.exam_questions.length + "\n";
        var hr = await User.findOne({_id: exam.job.owner});
       // console.log("hr = ", hr);
        this.send_email(exam.candidate.email, {
            subject: subject,
            body: body
        }, callback);
        this.send_email(hr.email, {
            subject: subject,
            body: body
        }, callback);

    },

    send_exams_to_candidate: async function (links,candidate, callback) {
        var subject = candidate.username + ' candidate exams';
        var body = "";
        for (var i = 0; i < links.length; i++) {
            body.concat("Exam "+i+"link is here"+links[i]+"\n");
        }

        this.send_email(candidate.email, {
            subject: subject,
            body: body
        }, callback);

    }

};

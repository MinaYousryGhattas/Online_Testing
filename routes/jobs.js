var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var job = require('./../models/job');
const Job = mongoose.model('job');
const uuidv1 = require('uuid/v1');
uuidv1();
var {ensureAuthenticated} = require('./../config/auth');

/////////////////////////////////////////////////
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
/////////////////////////////////////////////////


router.get('/apply_form/:id', ensureAuthenticated, (req,res)=>{
    res.render('job/apply_form',{
        job_id: req.params.id
    });
});


router.post('/apply_form', ensureAuthenticated,upload_cv.single('cv'), (req,res)=>{
    Job.findOne({_id: req.body._id})
        .populate('applicants.user')
        .then(job=>{
            if (job){
                check_user_applied = job.applicants.find(applicant => applicant.user._id == req.user.id);
                if (check_user_applied){
                    req.flash('error_message', 'You already applied');
                    res.redirect('/');
                }else {
                    job.applicants.push({
                        user: req.user._id,
                        cv: req.file.path
                    });
                    job.save().then(job=>{
                       req.flash('success_message','Done');
                       res.redirect('/');
                    });
                }
            }
        }).catch(err=>{
            req.flash('error_message', "Job doesn't existed");
            res.redirect('/');
        })
});

router.get('/create_job', ensureAuthenticated, (req, res)=>{
    res.render('job/create_job')
});

router.post('/create_job', ensureAuthenticated, (req,res)=>{
    errors = [];
    if (req.body.title === ""){
        errors.push("Title is required")
    }
    if (req.body.description === ""){
        errors.push("Description  is required")
    }
    if (errors.length > 0){
        res.render('job/job_form',{
            title: job.body.title,
            description: req.body.description
        })
    }
    var new_job = new Job({
        title: req.body.title,
        description: req.body.description
    });
    new_job.save().then(job=>{
        req.flash("success_message", "Job is created successfully");
        req.redirect('/');
    }).catch(err=>{
        req.flash('error_message', "Job creation failed");
        req.render('job/job_form',{
            title: job.body.title,
            description: req.body.description
        });
    })
});


router.get('/view/:id',(req,res)=>{
    Job.findOne({
        _id: req.params.id
    }).then(job =>{
        res.render('job/job_view',{
            job: job
        })
    })
});

module.exports = router;
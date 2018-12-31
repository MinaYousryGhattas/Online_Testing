var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var router = express.Router();
var exam = require('./../models/exam');
var Exam = mongoose.model('exam');

router.get('/',async (req,res)=>{
    if (!req.query.search.replace(/\s/g, '').length){
        res.send([]);
        return
    }
    exams =  await Exam.find().populate('exam_type').populate('candidate');
    ex = await  exams.filter(exam => exam.candidate != null && (exam.exam_type.type_name.includes(req.query.search)
        || exam.candidate.email.includes(req.query.search)
        || exam.candidate.name.includes(req.query.search)
    ));
    console.log(ex.length);
    res.send(ex);
});

module.exports= router;
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var exam_type = require('./../models/exam_type');
const Exam_type = mongoose.model('exam_type');


router.get('/view',(req, res)=>{
    Exam_type.find().populate('topic').populate('question').then(exam_types=>{
        res.render('exam_type/show_exam_types',{
            exam_types: exam_types
        })
    })
});
router.get('/view_exam_type/:id',(req,res)=>{
    Exam_type.findOne({
        _id: req.params.id
    }).populate('topic').populate('question').then(exam_type =>{
        res.render('exam_type/view_exam_type',{
            exam_type: exam_type
        })
    })
});

module.exports = router;
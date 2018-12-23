var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var exam = require('./../models/exam');
var exam_type = require('./../models/exam_type')
const Exam = mongoose.model('exam');
const ExamType = mongoose.model('exam_type');

//lsa bytgrb
router.get('/:id',(req,res)=>{
    ExamType.findOne({
        'type_name':'java'
    }, function(err, item) {
        console.log('world', item.type_name);
        console.log('world2', item._id);

    });
});

module.exports = router;

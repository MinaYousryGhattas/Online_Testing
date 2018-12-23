var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var question = require('./../models/question');
const Question = mongoose.model('question');

router.get('/',(req, res)=>{
    Question.find().then(questions=>{
        res.render('question/show_question',{
            questions: questions
        })
    })
});
router.get('/view_question/:id',(req,res)=>{
    Question.findOne({
        _id: req.params.id
    }).then(question =>{
        res.render('question/view_question',{
            question: question
        })
    })
});

module.exports = router;
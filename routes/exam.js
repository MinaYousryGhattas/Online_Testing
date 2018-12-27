var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var topic = require('./../models/topic');
const Topic = mongoose.model('topic');
var exam = require('./../models/exam');
var exam_type = require('./../models/exam_type')
var question = require('./../models/question');
const Question = mongoose.model('question');
const Exam = mongoose.model('exam');
const ExamType = mongoose.model('exam_type');
var sleep = require('system-sleep');
var exam_controller = require('./../controllers/exam_controller');
var qs = require('querystring');

router.get('/:id',(req,res)=>{
    Exam.findOne({
        _id: req.params.id
    }).populate('exam_type')
        .populate('exam_questions')
        .then(exam=> {
            exam.exam_questions = [];
            exam_controller.generateExam(exam, function (error, result)
            {
                exam.save().then(
                    res.render('exam/candidate_exam', {
                        exam: exam
                       // exam_q: exam_q
                    })
                )
            })
        })
})

router.post('/submit_exam/:id',(req, res)=>{
    console.log(req.body);
    var number_skipped = 0;
    var number_marked = 0;
    var number_solved = 0;
    Exam.findOne({
        _id: req.params.id
    }).populate('exam_type')
        .populate('exam_questions')
        .then(exam=> {
             for (var i=0; i<exam.exam_questions.length; i++)
             {
                 var d = exam.exam_questions[i]._id;
                 console.log("solv : ", req.body[d]);
                 if(req.body[d] == undefined)
                 {
                     exam.exam_questions[i].candidateAnswer = "skip";
                     number_skipped = number_skipped + 1;
                 }
                 else
                 {
                     if (req.body[d].length == 2)
                     {
                         exam.exam_questions[i].marked = true;
                         exam.exam_questions[i].candidateAnswer = req.body[d][1];
                         number_marked = number_marked + 1;
                         number_solved = number_solved + 1;
                     }
                     else
                     {
                         if (req.body[d] == exam.exam_questions[i].the_question) {
                             exam.exam_questions[i].marked = true;
                             number_marked = number_marked + 1;
                             exam.exam_questions[i].candidateAnswer = "skip";
                             number_skipped = number_skipped + 1;
                         }
                         else {
                             exam.exam_questions[i].candidateAnswer = req.body[d];
                             number_solved = number_solved + 1;
                         }
                     }
                 }
                 console.log(exam.exam_questions[i]);
             }
             exam.save().then(
                 res.render('exam/candidate_exam_result', {
                     //exam: exam,
                     number_solved: number_solved,
                     number_marked: number_marked,
                     number_skipped: number_skipped
                 }));

        })
});

module.exports = router;
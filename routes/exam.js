var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var topic = require('./../models/topic');
const Topic = mongoose.model('topic');
var exam = require('./../models/exam');
var exam_type = require('./../models/exam_type');
var question = require('./../models/question');
const Question = mongoose.model('question');
const Exam = mongoose.model('exam');
const ExamType = mongoose.model('exam_type');
var exam_controller = require('./../controllers/exam_controller');
var email_controller = require('./../controllers/email_controller');
var {ensureAuthenticated} = require('./../config/auth');


router.get('/:id',ensureAuthenticated,(req,res)=> {
    Exam.findOne({
        _id: req.params.id
    }).populate('exam_type')
        .populate('exam_questions')
        .then(ex => {
            Exam.findOne({
                exam_type: ex.exam_type._id,
                candidate: req.user._id
            }).populate('exam_type')
                .populate('exam_questions')
                .then(exam => {
                    if(exam == null)
                    {
                        let exam = new Exam({"exam_type": ex.exam_type, "candidate": req.user._id, "job": ex.job._id});
                        exam_controller.generateExam(exam, function (error, result)
                        {
                            exam.save().then(
                                res.render('exam/start_exam', {
                                    exam: exam
                                }))
                        })
                    }
                    else
                    {
                        if (exam.exam_questions[0].candidateAnswer[0] == "?")
                        {
                            res.render('exam/start_exam', {
                                exam: exam
                            })

                        }
                        else
                        {
                            res.render('exam/solved_exam', {
                                exam: exam,
                                total_score: exam.exam_questions.length
                            })
                        }
                    }
                })
        })
});

router.get('/start/:id',ensureAuthenticated,(req, res)=>{

    Exam.findOne({
        _id: req.params.id,
        candidate: req.user._id
    }).populate('exam_type')
        .populate('exam_questions')
        .then(exam=> {
           // console.log("found = ", exam);
            res.render('exam/candidate_exam', {
                    exam: exam
                })
        })
});

router.post('/save_answer',(req, res)=>{
    let ans = req.body.answer;
    var qID = req.body.id;
    Question.findOne({
        _id: qID
    }).then(q => {
            q.candidateAnswer = ans;
            q.save().then(
                res.send(true)
            );

        })
});

router.post('/submit_exam/:id',(req, res)=>{
    //console.log(req.body);
    var number_skipped = 0;
    var number_marked = 0;
    var number_solved = 0;
    var score = 0;
    Exam.findOne({
        _id: req.params.id
    }).populate('exam_type')
        .populate('exam_questions').populate('candidate').populate("job")
        .then(exam=> {
             for (var i=0; i<exam.exam_questions.length; i++)
             {
                 var d = exam.exam_questions[i]._id;
                 if(req.body[d] == undefined)
                 {
                     if(exam.exam_questions[i].candidateAnswer[0] == "?")
                     {
                         exam.exam_questions[i].candidateAnswer = "skip";
                         number_skipped = number_skipped + 1;
                     }
                     else {
                         if (exam.exam_questions[i].candidateAnswer == exam.exam_questions[i].right_answers)
                             score = score + 1;
                         number_solved = number_solved + 1;
                     }
                 }
                 else
                 {
                     exam.exam_questions[i].marked = true;
                     number_marked = number_marked + 1;
                     if(exam.exam_questions[i].candidateAnswer[0] == "?")
                     {
                         exam.exam_questions[i].candidateAnswer = "skip";
                         number_skipped = number_skipped + 1;
                     }
                     else {
                         if (exam.exam_questions[i].candidateAnswer == exam.exam_questions[i].right_answers)
                             score = score + 1;
                         number_solved = number_solved + 1;
                     }
                 }
                 exam.exam_questions[i].save();
             }
             exam.score = score;
             exam.save().then(
                 email_controller.send_exam_result_to_hr_and_candidate(exam, (error,info)=>{
                     console.log(info)
                 }),
                 res.render('exam/candidate_exam_result', {
                     exam: exam,
                     number_solved: number_solved,
                     number_marked: number_marked,
                     number_skipped: number_skipped,
                     score: score,
                     total_score: exam.exam_questions.length
                 }));
        })
});

module.exports = router;
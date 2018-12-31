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
var job = require('./../models/job');
const Job = mongoose.model('job');
var user = require('./../models/user');
const User = mongoose.model('user');

router.get('/:id',ensureAuthenticated,(req,res)=> {
    Exam.findOne({
        _id: req.params.id
    }).populate('exam_type')
        .populate('exam_questions')
        .then(ex => {
            console.log("ex = ", ex);
            Exam.findOne({
                exam_type: ex.exam_type._id,
                candidate: req.user._id,
                job: ex.job._id
            }).populate('exam_type')
                .populate('exam_questions')
                .then(exam => {
                    if(exam == null || exam.candidate == null )
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
                        if (exam.exam_questions[0].candidateAnswer[0] == "?" )
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
        .populate('exam_questions').populate('candidate').populate("job").populate("owner")
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

function getTotalScores(exams)
{
    var total_scores = 0;
    var candidate_total_scores = 0;
    for (var i=0;i<exams.length;i++)
    {
        candidate_total_scores += exams[i].score;
        total_scores += exams[i].exam_questions.length;
    }
    return {candidate_total_scores,total_scores};
}
router.get('/view_candidate_report/:id',ensureAuthenticated,(req,res)=> {
    Exam.find({
        candidate: req.params.id
    }).populate('exam_type').populate('exam_questions').then(async exams => {
        let scores = await getTotalScores(exams);
        res.render('exam/exam_report', {
            exams: exams,
            total_scores: scores.total_scores,
            candidate_total_scores: scores.candidate_total_scores
        })
    })
});

router.get('/solved/:user/:job',function (req, res) {
    res.render('exam/show_candicate_solution',{
        job:req.params.job,
        userid:req.params.user

    });
});
router.post('/solved/:user/:j',async function(req, res) {

    var job = await Job.findOne({"applicants._id": req.params.j});

   var user= await User.findOne({_id:req.params.user});

    var examType= await ExamType.findOne({type_name:req.body.selected_exam});

    await Exam.findOne( {$and : [{candidate:user._id},{job:job._id},{exam_type:examType._id}]}).populate('exam_type')
    .populate('exam_questions').then(exam=>
    {

        if (exam.exam_questions[0].candidateAnswer[0] != "?"){
            res.render("exam/user_solutions",{
                questions:exam.exam_questions
            });
        }

    }).catch(err=>{
            res.render("exam/user_solutions");
            }
        )


});

module.exports = router;

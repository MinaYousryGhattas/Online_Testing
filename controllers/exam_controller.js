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
var counter =  "01";


// async function getExamsLinks(types, job) {
//     let links = [];
//     for (var i = 0; i < types.length; i++) {
//         var ex_type = await ExamType.findOne({"type_name": types[i]});
//         var ex = await Exam.findOne({"exam_type": ex_type._id, "candidate": null}).populate("exam_type");
//         let new_exam = new Exam({"exam_type": ex.exam_type, "candidate": null, "job": job});
//         await new_exam.save();
//         var job_exam = await Exam.findOne({"exam_type": ex.exam_type, "candidate": null, "job": job});
//         var link = "http://localhost:3000/exams/" + job_exam._id;
//         links.push(link);
//     }
//     return links;
// }

async function getQuestionByID(id, exam, callback) {
    question = await Question.findOne({_id: id});
    var quest = new Question({"the_question" : question.the_question, "candidateAnswer" : "???"+counter, "marked" : "false", "right_answers" : question.right_answers, "wrong_answers" : question.wrong_answers });
    quest.save();
    new_q = await Question.findOne({"candidateAnswer" : "???"+counter});

    exam.exam_questions.push(new_q);
    counter = counter + "0";
    //console.log('length = ', new_q);
}

async function getTopicByID(id,exam,callback)
{
    topic = await Topic.findOne({
        _id: id
    }).populate('question');

    for (var i = 0; i < topic.questions.length; i++) {
        if (i == 0)
            await getQuestionByID(topic.questions[i], exam, callback);
        else
        {
            var take = Math.floor(Math.random() * 3) + 1;
            //console.log(take);
            if(take == 1)
                await getQuestionByID(topic.questions[i], exam, callback);
        }
    }
}

async function getExamType(exam,callback) {
    for (var i = 0; i < exam.exam_type.topics.length; i++)
        await getTopicByID(exam.exam_type.topics[i],exam,callback);
    callback(true, exam);
}

module.exports = {
    generateExam: async function (exam, callback) {
       // exam_q = [];
        exam1 = await getExamType(exam,callback);
    },
    //types array of string , job is the id of applied job object
    getExamsLinks: async function (types, job) {
        console.log("types: ", types, "job: ", job);
        let links = [];
        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            console.log(type);
            var ex_type = await ExamType.findOne({"type_name": type });
            var ex = await Exam.findOne({"exam_type": ex_type._id, "candidate": null}).populate("exam_type");
            let new_exam = new Exam({"exam_type": ex.exam_type, "candidate": null, "job": job});
            await new_exam.save();
            var job_exam = await Exam.findOne({"exam_type": ex.exam_type, "candidate": null, "job": job});
            var link = "http://localhost:3000/exams/" + job_exam._id;
            links.push(link);
        }
        return links;
    }
};

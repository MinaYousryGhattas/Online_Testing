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
var sync = require('sync');
var counter =  "0";
//var exam_q = [question];
async function getQuestionByID(id, exam, callback) {
    question = await Question.findOne({_id: id});
    var quest = new Question({"the_question" : question.the_question, "candidateAnswer" : "????"+counter, "marked" : "false", "right_answers" : question.right_answers, "wrong_answers" : question.wrong_answers });
    quest.save();
    new_q = await Question.findOne({"candidateAnswer" : "????"+counter});

    exam.exam_questions.push(new_q);
    //exam_q.push(new_q);
    counter = counter + "0";
    //console.log('length = ', exam.exam_questions.length);
}

async function getTopicByID(id,exam,callback)
{
    topic = await Topic.findOne({
        _id: id
    }).populate('question');

    for (var i = 0; i < topic.questions.length; i++)
        await getQuestionByID(topic.questions[i] ,exam,callback);
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
    }
};

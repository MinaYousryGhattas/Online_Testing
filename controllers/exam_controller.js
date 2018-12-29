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
const Exam_type = mongoose.model('exam_type');
var counter =  "01";


function getExamsLinks(types)
{
    let links = [];
    for (var i=0; i<types.length; i++)
    {
        var ex_type = Exam_type.find({type_name: types[i]});
        var ex = Exam.find({exam_type: ex_type._id, candidate: null});
        var link = "http://localhost:3000/exams/"+ ex._id;
        links.push(link);
    }
}

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
    }
};

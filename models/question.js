let mongoose = require('mongoose');
let schema = mongoose.Schema;

const QuestionSchema = new schema({

        theQuestion: {
            type: String,
            required: true
        },
        candidateAnswer: {
            type: String,
            required: true
        },
        marked: {
            type: boolean,
            required: true
        },
        rightAnswers: [{
            type: String,
            required: true
        }]
        wrongAnswers: [{
            type: String,
            required: true
        }]
);
mongoose.model('question',QuestionSchema);
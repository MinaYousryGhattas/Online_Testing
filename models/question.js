let mongoose = require('mongoose');
let schema = mongoose.Schema;

const QuestionSchema = new schema({
    //db.questions.insertOne({"the_question": "What is your name?", "candidateAnswer":"??", "marked": "false", "right_answers":["Nardeen"],"wrong_answers":"Mina"})
        the_question: {
            type: String,
            required: true
        },
        candidateAnswer: {
            type: String,
            required: true
        },
        marked: {
            type: Boolean,
            required: true
        },
        right_answers: [{
            type: String,
            required: true
        }],
        wrong_answers: [{
            type: String,
            required: true
        }]
    },
    {usePushEach: true},
    {usePullEach: true}
);
mongoose.model('question',QuestionSchema);
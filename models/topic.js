let mongoose = require('mongoose');
let schema = mongoose.Schema;

const TopicSchema = new schema({
        name: {
            type: String,
            required: true
        },
        questions: [{
            type: schema.Types.ObjectId,
            ref: 'question'
        }]
    },
    {usePushEach: true},
    {usePullEach: true}
);
// db.topics.insertOne({"name":"oo","questions":[{"the_question": "What?", "candidateAnswer":"??","marked": "false", "right_answers":["Nardeen"],"wrong_answers":["Mina"]}]})

mongoose.model('topic',TopicSchema);
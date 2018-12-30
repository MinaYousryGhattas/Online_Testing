//import {Double} from "mongodb";

let mongoose = require('mongoose');
let schema = mongoose.Schema;

const ExamSchema = new schema({
        exam_type: {
            type: schema.Types.ObjectId,
            ref: 'exam_type'
        },
        candidate: {
            type: schema.Types.ObjectId,
            ref: 'user'
        },
        exam_questions: [{
            type: schema.Types.ObjectId,
            ref: 'question'
        }],
        score:{
            type: Number,
            required: false
        },
        job:{
            type: schema.Types.ObjectId,
            ref: 'job'
        }
    },
    {usePushEach: true},
    {usePullEach: true}
);
mongoose.model('exam',ExamSchema);
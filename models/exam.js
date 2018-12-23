let mongoose = require('mongoose');
let schema = mongoose.Schema;

const ExamSchema = new schema({
        exam_type: {
            type: schema.Types.ObjectId,
            ref: 'exam_type'
        },
        exam_questions: [{
            type: schema.Types.ObjectId,
            ref: 'Question'
        }]
    },
    {usePushEach: true},
    {usePullEach: true}
);
mongoose.model('exam',ExamSchema);
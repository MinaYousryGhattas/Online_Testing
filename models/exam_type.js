let mongoose = require('mongoose');
let schema = mongoose.Schema;

const ExamTypeSchema = new schema({
        type_name: {
            type: String,
            required: true
        },
        topics: [{
            type: schema.Types.ObjectId,
            ref: 'topic'
        }]
    },
    {usePushEach: true},
    {usePullEach: true}
);
mongoose.model('exam_type',ExamTypeSchema);
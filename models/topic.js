let mongoose = require('mongoose');
let schema = mongoose.Schema;

const TopicSchema = new schema({
        name: {
            type: String,
            required: true
        },
        questions: [{
            type: schema.Types.ObjectId,
            ref: 'Question'
        }]
    },
    {usePushEach: true},
    {usePullEach: true}
);
mongoose.model('topic',TopicSchema);
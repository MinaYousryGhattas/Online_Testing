var mongoose = require('mongoose');
const schema = mongoose.Schema;


const job_schema = new schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    applicants: {
        type: [
            {
                user : { type: schema.Types.ObjectId, ref: 'user' },
                cv  : {},
                status: { type: Boolean, default: false},
            }
        ]
    },
    created_at:{
        type: Date,
        default: Date.now()
    }

},  { usePushEach: true },
    { usePullEach: true });

mongoose.model('job', job_schema);
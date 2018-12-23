let mongoose = require('mongoose');
const schema = mongoose.Schema;

const hr_schema = new schema({

    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }

});
//mongoose.connect('mongodb://localhost/online_testing');
mongoose.model('hr', hr_schema);
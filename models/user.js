let mongoose = require('mongoose');
const schema = mongoose.Schema;

const user_schema = new schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    BOD: {
        type: Date,
        required: false
    },
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
mongoose.model('user', user_schema);
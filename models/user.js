const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('user', new Schema({
    email: {
        required: true,
        type: String,
        unique: true
    },
    createdDate: {
        required: true,
        type: Date
    }
}));

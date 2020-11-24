const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('credentials', new Schema({
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    }
}));

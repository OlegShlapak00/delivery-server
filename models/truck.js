const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('truck', new Schema({
    created_by: {
        required: true,
        type: String,
    },
    assign_to: {
        required: true,
        type: String
    },
    type: {
        required: true,
        type: String,
        enum: ["SPRINTER", "SMALL STRAIGHT", "LARGE STRAIGHT"]
    },
    status: {
        required: true,
        type: String,
        enum: ["OL","IS","OS"],
        default: "IS"
    },
    created_date:{
        required: true,
        type: Date,
    }
}));

const mongoose = require('mongoose');
const Schema = mongoose.Schema;



module.exports = mongoose.model('registrationCredentials', new Schema({
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String
    },
    role: {
        required: true,
        type: String,
        enum: [ "SHIPPER", "DRIVER" ]
    }
}));

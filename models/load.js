const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('load', new Schema({
    created_by: {
        required: true,
        type: String,
    },
    assigned_to: {
        required: true,
        type: String
    },
    status: {
        required: true,
        type: String,
        enum: [ "NEW", "POSTED", "ASSIGNED", "SHIPPED"]
    },
    state: {
        required: true,
        type: String,
        enum: [ "En route to Pick Up", "Arrived to Pick Up", "En route to delivery", "Arrived to delivery"]
    },
    name:{
        required: true,
        type: String
    },
    payload:{
        required: true,
        type: Number
    },
    pickup_address:{
        required: true,
        type: String
    },
    delivery_address:{
        required: true,
        type: String
    },
    dimensions:{
        required:true,
        type: {
            width:{
              required:true,
              type: Number
            },
            length:{
                required:true,
                type: Number
            },
            height:{
                required:true,
                type: Number
            }
        }
    },
    logs:{
        type:[{
            massage:{
                required:true,
                type: String
            },
            time:{
                required:true,
                type: Date
            }
        }]
    },
    created_date:{
        required:true,
        type: Date
    }
}));

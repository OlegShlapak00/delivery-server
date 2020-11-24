const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Credential = require('../models/credentials');
const RegistrationCredentials = require('../models/registrationCredentials');
const {secret} = require('../configs/auth');


module.exports.register = (request, response) => {
    const {email, password, role} = request.body;
    const createdDate = new Date();
    const user = new User({email, createdDate});
    const credential = new Credential({email, password});
    const regCredential = new RegistrationCredentials({email, password,role});
    regCredential.save()
        .then(() => {
            if (!email || !password || !role) {
                return   response.status(400).json({massage: "string"});
            }
            user.save()
                .catch(() => {
                    return  response.status(500).json({massage: "string"});
                });
            credential.save()
                .catch(() =>{
                    return  response.status(500).json({massage: "string"});
                })
            return  response.json({massage: 'Success'});
        })
        .catch(() => {
            return  response.status(500).json({massage: "string"});
        });
}

module.exports.login = (request, response) => {

    const {email, password} = request.body;

    RegistrationCredentials.findOne({email, password}).exec()
        .then(user => {
            if (!user) {
                return response.status(400).json({massage: "string"});
            }
            return  response.json({massage: 'success', token: jwt.sign(JSON.stringify(user), secret)});
        })
        .catch(() => {
            return  response.status(500).json({massage: "string"});
        });
}
module.exports.forgot_password = (request, response) => {

    const {email} = request.body;

    Credential.findOne({email}).exec()
        .then(user => {
            if (!user) {
                return response.status(400).json({massage: "string"});
            }
            return  response.json({massage: 'New password sent to your email address',});
        })
        .catch(() => {
            return  response.status(500).json({massage: "string"});
        });
}

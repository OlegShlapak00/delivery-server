const User = require('../models/user');
const jwt = require("jsonwebtoken");
const Credential = require('../models/credentials');
const  registrationCredentials = require('../models/registrationCredentials');

module.exports.getMe = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    const email = jwt.decode(token).email;
    User.findOne({"email": email},{__v:0},  (err, user) => {
            if (!user) {
                return response.status(400).json({massage: "string"})
            }
            return response.status(200).json({user: user})
        }
    ).catch(() => {
        return response.status(500).json({massage: "string"})
    })
}

module.exports.deleteMe = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    const email = jwt.decode(token).email;
    Credential.deleteOne({"email": email})
        .then(() => {
            User.deleteOne({"email": email})
                .then(() => {
                    registrationCredentials.deleteOne({"email": email})
                        .then(() => {
                                return response.status(200).json({massage: "Success"});
                            }
                        )
                        .catch(() => {
                                return response.status(500).json({massage: "string"});
                            }
                        )
                    }
                )
                .catch(() => {
                        return response.status(500).json({massage: "string"});
                    }
                )
        })
        .catch(() => {
                return response.status(500).json({massage: "string"});
            }
        );
}

module.exports.changePassword = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    const password = jwt.decode(token).password;
    const email = jwt.decode(token).email;
    const {oldPassword, newPassword} = request.body;
    if(oldPassword !== password){
        return response.status(400).json({massage: "string"});
    }
    Credential.updateOne({"password": password, "email": email}, {password: newPassword})
        .then(() => {
            if (!oldPassword || !newPassword) {
                return response.status(400).json({massage: "string"});
            }
            registrationCredentials.updateOne({"password":password}, {password:newPassword})
                .then(() =>{
                    return response.status(200).json({massage: "Password changed successfully"});
                })
                .catch(() => {
                        return response.status(500).json({massage: "string"});
                    }
                )
        })
        .catch(() => {
                return response.status(500).json({massage: "string"});
            }
        );
}

const User = require('../models/user');
const jwt = require("jsonwebtoken");
const  registrationCredentials = require('../models/registrationCredentials');

module.exports.getMe = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    const id = jwt.decode(token).user._id;
    User.findOne({"_id": id },{__v:0},  (err, user) => {
            if (!user) {
                return response.status(400).json({massage: err})
            }
            return response.status(200).json({user: user})
        }
    ).catch((err) => {
        return response.status(500).json({massage: err})
    })
}

module.exports.deleteMe = (request, response) => {
    let [, token] = request.headers.authorization.split(' ');
    token = jwt.decode(token);
    registrationCredentials.deleteOne({"_id": token.regCred._id})
        .then(() => {
            User.deleteOne({"_id": token.user._id})
                .then(() => {
                    return response.status(200).json({massage: "Success"});
                    }
                )
                .catch((err) => {
                        return response.status(500).json({massage: err});
                    }
                )
        })
        .catch((err) => {
                return response.status(500).json({massage: err});
            }
        );
}

module.exports.changePassword = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    const password = jwt.decode(token).regCred.password;
    const {oldPassword, newPassword} = request.body;
    if(oldPassword !== password){
        return response.status(400).json({massage: "Wrong old password"});
    }
    if(!oldPassword || !newPassword){
        return response.status(400).json({massage: "Bad request"});
    }
    registrationCredentials.updateOne({"password": password}, {password: newPassword})
        .then(() => {
            return response.status(200).json({massage: "Password changed successfully"});
        })
        .catch((err) => {
                return response.status(500).json({massage: err});
            }
        );
}

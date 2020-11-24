const jwt = require('jsonwebtoken');
const Truck = require('../models/truck');
const User = require('../models/user');

module.exports.getTrucks = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    const userRole = jwt.decode(token).role;
    const userEmail = jwt.decode(token).email;
    if (userRole !== "DRIVER") {
        return response.status(400).json({massage: "string"});
    }

    User.findOne({email:userEmail})
        .then(user =>{
            if(!user){
                response.status(500).json({massage: "string"});
            }
            console.log(user._id);
            Truck.find({created_by: user._id}, {__v: 0})
                .exec()
                .then(trucks => {
                    return response.status(200).json({trucks: trucks});
                })
                .catch(() => {
                    response.status(500).json({massage: "string"});
                });
        })
        .catch(() => {
            response.status(500).json({massage: "string"});
        });


}

module.exports.getTrucksById = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    const TruckId = request.params.id;
    const userEmail = jwt.decode(token).email;
    const userRole = jwt.decode(token).role;

    if (userRole !== "DRIVER") {
        return response.status(400).json({massage: "string"});
    }
    User.findOne({email:userEmail})
        .then(user =>{
            if(!user){
                response.status(500).json({massage: "string"});
            }
            console.log(user._id);
            Truck.findOne({created_by: user._id, _id:TruckId }, {__v: 0})
                .exec()
                .then(trucks => {
                    return response.status(200).json({truck: trucks});
                })
                .catch(() => {
                    response.status(500).json({massage: "string"});
                });
        })
        .catch(() => {
            response.status(500).json({massage: "string"});
        });
}

module.exports.addTruck = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    let id; //user id
    const userRole = jwt.decode(token).role;
    const userEmail = jwt.decode(token).email;
    const {type} = request.body;
    const status = "OS";
    const created_date = new Date();

    User.findOne({email: userEmail})
        .then(user => {
            if (!user) {
                return response.status(500).json({massage: "string"});
            }
            id = user._id;
            const truck = new Truck({"created_by": id, "assign_to": "null", type, status, created_date});
            truck.save()
                .then(() => {
                    if (!type || userRole !== "DRIVER") {
                        return response.status(400).json({massage: "bad"});
                    }
                    return response.status(200).json({massage: 'Truck created successfully'});
                })
                .catch((arr) => {
                    return response.status(500).json({massage: arr});
                });
        })
        .catch(() => {
            response.status(500).json({massage: "string"});
        });
}

module.exports.updateTruck = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    const TruckId = request.params.id;
    const newType = request.body.type;
    const userRole = jwt.decode(token).role;

    if (userRole !== "DRIVER") {
        return response.status(400).json({massage: "string"});
    }

    Truck.findOne({_id: TruckId})
        .then(truck => {
            if (!truck || truck.assign_to !== "null") {
                return response.status(400).json({massage: "string"});
            }
            Truck.updateOne({_id: TruckId}, {type: newType})
                .exec()
                .then(() => {
                    return response.status(200).json({massage: "Truck details changed successfully"});
                })
                .catch(() => {
                    response.status(500).json({massage: "string"});
                });
        })
        .catch(() => {
            response.status(500).json({massage: "string"});
        });
}

module.exports.deleteTruck = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    const TruckId = request.params.id;
    const userRole = jwt.decode(token).role;

    if (userRole !== "DRIVER") {
        return response.status(400).json({massage: "string"});
    }
    Truck.findOne({_id: TruckId})
        .then(truck => {
            if (!truck || truck.assign_to !== "null") {
                return response.status(400).json({massage: "string"});
            }
            Truck.deleteOne({_id: TruckId})
                .then(() => {
                    return response.status(200).json({massage: "Truck deleted successfully"});
                })
                .catch(() => {
                    response.status(500).json({massage: "string"});
                });
        })
        .catch(() => {
            response.status(500).json({massage: "string"});
        });
}

module.exports.assignTo = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    const TruckId = request.params.id;
    const userRole = jwt.decode(token).role;
    const userEmail = jwt.decode(token).email;

    if (userRole !== "DRIVER") {
        return response.status(400).json({massage: "string"});
    }

    User.findOne({"email":userEmail})
        .then(user =>{
            if(!user){
                return response.status(500).json({massage: "string"});
            }
            Truck.updateOne({_id: TruckId}, {assign_to: user._id})
                .exec()
                .then(truck => {
                    if (!truck) {
                        return response.status(400).json({massage: "string"});
                    }
                    return response.status(200).json({massage: "Truck assigned successfully"});
                })
                .catch(() => {
                    response.status(500).json({massage: "string"});
                });
        })
}

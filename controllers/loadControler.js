const jwt = require('jsonwebtoken');
const Truck = require('../models/truck');
const User = require('../models/user');
const Load = require('../models/load');


module.exports.addLoad = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    let id; //user id
    const userRole = jwt.decode(token).role;
    const userEmail = jwt.decode(token).email;
    const {name, payload, pickup_address, delivery_address, dimensions} = request.body;
    const created_date = new Date();

    User.findOne({email: userEmail})
        .then(user => {
            if (!user) {
                return response.status(500).json({massage: "string"});
            }
            id = user._id;
            const load = new Load({
                created_by: id,
                assigned_to: "null",
                status: "NEW",
                state: "En route to Pick Up",
                name: name,
                payload: payload,
                pickup_address: pickup_address,
                delivery_address: delivery_address,
                dimensions: dimensions,
                created_date: created_date,
                logs: []
            });
            if (!name || !payload || !pickup_address || !delivery_address ||
                !dimensions.width || !dimensions.length || !dimensions.height ||
                userRole !== "SHIPPER") {
                return response.status(400).json({massage: "bad"});
            }
            load.save()
                .then(() => {
                    return response.status(200).json({massage: 'Load created successfully'});
                })
                .catch((arr) => {
                    return response.status(500).json({massage: arr});
                });
        })
        .catch(() => {
            response.status(500).json({massage: "string"});
        });
}

module.exports.getLoad = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    const userRole = jwt.decode(token).role;
    const userEmail = jwt.decode(token).email;

    User.findOne({email: userEmail})
        .then(user => {
            if (!user) {
                return response.status(500).json({massage: "string"});
            }
            if (userRole === "SHIPPER") {
                Load.find({created_by: user._id})
                    .then(loads => {
                        return response.status(200).json({loads: loads});
                    })
                    .catch(() => {
                        response.status(500).json({massage: "string"});
                    });
            } else {
                console.log(user._id);
                Load.find({assigned_to: user._id})
                    .then(loads => {
                        return response.status(200).json({loads: loads});
                    })
                    .catch(() => {
                        response.status(500).json({massage: "string"});
                    });
            }
        })
        .catch(() => {
            response.status(500).json({massage: "string"});
        });
}
module.exports.getActiveLoad = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    const userRole = jwt.decode(token).role;
    const userEmail = jwt.decode(token).email;

    User.findOne({email: userEmail})
        .then(user => {
            if (!user || userRole === "SHIPPER") {
                return response.status(500).json({massage: "string"});
            }
            Load.findOne({assigned_to: user._id, status: "ASSIGNED"})
                .then(load => {
                    return response.status(200).json({loads: load});
                })
                .catch(() => {
                    response.status(500).json({massage: "string"});
                });

        })
        .catch(() => {
            response.status(500).json({massage: "string"});
        });
}

module.exports.changeState = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    const userRole = jwt.decode(token).role;
    const userEmail = jwt.decode(token).email;

    User.findOne({email: userEmail})
        .then(user => {
            if (!user || userRole === "SHIPPER") {
                return response.status(500).json({massage: "string"});
            }
            Load.findOne({assigned_to: user._id, status: "ASSIGNED"})
                .then(load => {
                    let date;
                    switch (load.state) {
                        case "En route to Pick Up":
                            load.state = "Arrived to Pick Up";
                            date = new Date();
                            load.logs.push({massage: "change status to 'Arrived to Pick Up'", time: date});
                            break;
                        case "Arrived to Pick Up" :
                            load.state = "En route to delivery";
                            date = new Date();
                            load.logs.push({massage: "change status to 'En route to delivery'", time: date});
                            break;
                        case "En route to delivery" :
                            load.state = "Arrived to delivery";
                            date = new Date();
                            load.logs.push({massage: "change status to 'Arrived to delivery'", time: date});
                            break;
                        case "Arrived to delivery" :
                            response.status(400).json({massage: "string"});
                            break;
                    }
                    load.save();
                })
                .catch(() => {
                    response.status(500).json({massage: "string"});
                });
        })
        .catch(() => {
            response.status(500).json({massage: "string"});
        });
}
module.exports.getLoadById = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    const userRole = jwt.decode(token).role;
    const userEmail = jwt.decode(token).email;
    const Id = request.params.id;

    User.findOne({email: userEmail})
        .then(user => {
            if (!user) {
                return response.status(500).json({massage: "string"});
            }
            if (userRole === "SHIPPER") {
                Load.findOne({created_by: user._id, _id: Id})
                    .then(loads => {
                        return response.status(200).json({load: loads});
                    })
                    .catch(() => {
                        response.status(500).json({massage: "string"});
                    });
            } else {
                Load.findOne({assigned_to: user._id, _id: Id})
                    .then(loads => {
                        return response.status(200).json({load: loads});
                    })
                    .catch(() => {
                        response.status(500).json({massage: "string"});
                    });
            }
        })
        .catch(() => {
            response.status(500).json({massage: "string"});
        });
}

module.exports.updateLoadById = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    let id; //user id
    const userRole = jwt.decode(token).role;
    const userEmail = jwt.decode(token).email;
    const loadId = request.params.id;
    const {name, payload, pickup_address, delivery_address, dimensions} = request.body;

    User.findOne({email: userEmail})
        .then(user => {
            if (!user) {
                return response.status(500).json({massage: "string"});
            }
            id = user._id;
            if (!name || !payload || !pickup_address || !delivery_address ||
                !dimensions.width || !dimensions.length || !dimensions.height ||
                userRole !== "SHIPPER") {
                return response.status(400).json({massage: "bad"});
            }
            Load.findOneAndUpdate(
                {created_by: id, _id: loadId},
                {
                    name: name, payload: payload, pickup_address: pickup_address,
                    delivery_address: delivery_address, dimensions: dimensions
                })
                .then(() => {
                    return response.status(200).json({massage: "Load details changed successfully"});
                })
                .catch((arr) => {
                    return response.status(500).json({massage: arr});
                });
        })
        .catch(() => {
            response.status(500).json({massage: "string"});
        });
}
module.exports.deleteLoadById = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    let id; //user id
    const userRole = jwt.decode(token).role;
    const userEmail = jwt.decode(token).email;
    const loadId = request.params.id;


    User.findOne({email: userEmail})
        .then(user => {
            if (!user) {
                return response.status(500).json({massage: "string"});
            }
            id = user._id;
            if (userRole !== "SHIPPER") {
                return response.status(400).json({massage: "bad"});
            }

            Load.findOne({created_by: id, _id: loadId})
                .then(load => {
                    if (load.status !== "NEW") {
                        return response.status(400).json({massage: "can't delete posted loads"});
                    }
                    Load.deleteOne({created_by: id, _id: loadId})
                        .then(() => {
                            return response.status(200).json({massage: "Load deleted successfully"});
                        })
                        .catch((arr) => {
                            return response.status(500).json({massage: arr});
                        });
                })
                .catch(() => {
                    response.status(500).json({massage: "string"});
                });
        })
}
module.exports.postLoadById = (request, response) => {
    const [, token] = request.headers.authorization.split(' ');
    let Uerid; //user id
    const userRole = jwt.decode(token).role;
    const userEmail = jwt.decode(token).email;
    const loadId = request.params.id;

    User.findOne({email: userEmail})
        .then(user => {
            if (!user) {
                return response.status(500).json({massage: "string"});
            }
            Uerid = user._id;
            if (userRole !== "SHIPPER") {
                return response.status(400).json({massage: "bad"});
            }
            Load.findOneAndUpdate(
                {created_by: Uerid, _id: loadId, status:"NEW"},{status: "POSTED"})
                .then((load) => {
                    let recomendedSize;
                    if(load.dimensions.width<=300 && load.dimensions.length<=270 && load.dimensions.height<170){
                        recomendedSize = "SPRINTER";
                    }
                    else if(load.dimensions.width<=500 && load.dimensions.length<=250 && load.dimensions.height<170){
                        recomendedSize = "SMALL STRAIGHT";
                    }
                    else if(load.dimensions.width<=700 && load.dimensions.length<=350 && load.dimensions.height<200){
                        recomendedSize = "LARGE STRAIGHT";
                    }
                    else {
                        recomendedSize = "LARGE STRAIGHT";
                    }
                    Truck.findOne({status:"OS" , type:recomendedSize})
                        .then(truck =>{
                            if(!truck){
                                load.status = "NEW";
                                load.save();
                                return response.status(200).json({massage: "Load not posted", driver_found:false});
                            }
                            truck.status ="IS";
                            load.assigned_to = truck.assigned_to;
                            const date = new Date();
                            load.logs.push({massage: "assign to to user with id "+ Uerid, time: date});
                            load.status = "ASSIGNED";
                            load.save();
                            truck.save();
                            return response.status(200).json({massage: "Load  posted", driver_found:true});
                        })

                })
                .catch((arr) => {
                    return response.status(500).json({massage: arr});
                });
        })
        .catch(() => {
            response.status(500).json({massage: "string"});
        });
}



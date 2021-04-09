const Truck = require('../models/truck');
const Load = require('../models/load');


module.exports.addLoad = (request, response) => {
    const {name, payload, pickup_address, delivery_address, dimensions} = request.body;
    const created_date = new Date();
    const id = request.token.user._id;

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
    load.save()
        .then(() => response.status(200).json({massage: 'Load created successfully'}),
            (err) => response.status(500).json({massage: err})
        )

}

module.exports.getLoad = (request, response) => {

    const id = request.token.user._id;

    if (request.token.regCred.role === "DRIVER") {
        Load.find({assigned_to: id})
            .then(
                (loads) => {
                    return response.status(200).json({loads: loads});
                },
                (err) => {
                    return response.status(500).json({massage: err});
                }
            )
    }
    if (request.token.regCred.role === "SHIPPER") {
        Load.find({created_by: id})
            .then(
                (loads) => {
                    return response.status(200).json({loads: loads});
                },
                (err) => {
                    return response.status(500).json({massage: err});
                }
            )
    }
}

module.exports.getActiveLoad = (request, response) => {
    const id = request.token.user._id;

    Load.findOne({assigned_to: id, status: "ASSIGNED"})
        .then(
            (load) => {
                return response.status(200).json({load: load});
            },
            (err) => {
                return response.status(500).json({massage: err});
            }
        )
}

module.exports.changeState = (request, response) => {
    const stateArr = ["En route to Pick Up", "Arrived to Pick Up", "En route to delivery", "Arrived to delivery"];
    const id = request.token.user._id;

    Load.findOne({assigned_to: id, status: "ASSIGNED"})
        .then(load => {
            if(!load){
                return response.status(400).json({massage: "already shipped"});
            }
            const date = new Date();
            let currStateIndex = stateArr.findIndex((el)=> el === load.state);
            if (currStateIndex === -1) {
                return response.status(500).json({massage: "Server error"});
            }
            if(currStateIndex === 2){
                load.status = 'SHIPPED';
                Truck.findOneAndUpdate({assign_to: id},{status: "IS"})
                    .then((truck) => {
                        truck.save();
                        console.log(truck);
                    });
            }
            load.logs.push({time: date, massage: `change state to "${stateArr[currStateIndex + 1]}"`});
            load.state = stateArr[currStateIndex + 1];
            load.save()
                .then((load) => response.status(200).json({massage: `state changed to ${load.state}`}))
        })
        .catch((err) => {
            return response.status(500).json({massage: err});
        });
}
module.exports.getLoadById = (request, response) => {
    const userId = request.token.user._id;
    const Id = request.params.id;
    if (request.token.regCred.role === "DRIVER") {
        Load.findOne({assigned_to: userId, _id: Id})
            .then(load => {
                return response.status(200).json({load: load});
            })
            .catch(() => {
                response.status(500).json({massage: "string"});
            });
    }
    if (request.token.regCred.role === "SHIPPER") {
        Load.findOne({created_by: userId, _id: Id})
            .then(load => {
                return response.status(200).json({load: load});
            })
            .catch(() => {
                response.status(500).json({massage: "string"});
            });
    }


}

module.exports.updateLoadById = (request, response) => {
    const loadId = request.params.id;
    const {name, payload, pickup_address, delivery_address, dimensions} = request.body;

    if (!name || !payload || !pickup_address || !delivery_address ||
        !dimensions.width || !dimensions.length || !dimensions.height) {
        return response.status(400).json({massage: "bad request"});
    }
    Load.findOneAndUpdate({_id: loadId}, {
        name: name,
        payload: payload,
        pickup_address: pickup_address,
        delivery_address: delivery_address,
        dimensions: dimensions
    })
        .then(() => {
            return response.status(200).json({massage: "Load details changed successfully"});
        })
        .catch((err) => {
            return response.status(500).json({massage: err});
        });
}
module.exports.deleteLoadById = (request, response) => {
    const userId = request.token.user._id;
    const loadId = request.params.id;
    Load.findOne({created_by: userId, _id: loadId})
        .then(
            (load) => {
                if (load.status !== "NEW"){
                    return response.status(400).json({massage: "can`t delete posted load"});
                }

            }
        )
        .then( () =>
            Load.findOneAndDelete({created_by: userId, _id: loadId})
        )
        .then(
            (load) => {
                console.log(load);
                return response.status(200).json({massage: "Load successfully deleted"});
            }
        )
        .catch((err) => {
            return response.status(500).json({massage: err});
        })

}
module.exports.postLoadById = (request, response) => {

    const loadId = request.params.id;
    let recommendedSize;
    Load.findOneAndUpdate(
        { _id: loadId, status: "NEW"}, {status: "POSTED"})
        .then((load) => {
            if(!load){
                return response.status(200).json({massage: "Wrong load id"});
            }
            if (load.dimensions.width <= 300 && load.dimensions.length <= 270 && load.dimensions.height < 170) {
                recommendedSize = "SPRINTER";
            } else if (load.dimensions.width <= 500 && load.dimensions.length <= 250 && load.dimensions.height < 170) {
                recommendedSize = "SMALL STRAIGHT";
            } else if (load.dimensions.width <= 700 && load.dimensions.length <= 350 && load.dimensions.height < 200) {
                recommendedSize = "LARGE STRAIGHT";
            } else {
                recommendedSize = "LARGE STRAIGHT";
            }
            return load;

        })
        .then( (load) => {
            Truck.findOne({status: "IS", type: recommendedSize})
                .then(truck => {
                    if (!truck) {
                        load.status = "NEW";
                        load.save();
                        return response.status(200).json({massage: "Load not posted", driver_found: false});
                    }
                    truck.status = "OL";
                    load.assigned_to = truck.assign_to;
                    const date = new Date();
                    load.logs.push({massage: "assign to to user with id " + truck.assign_to, time: date});
                    load.status = "ASSIGNED";
                    load.save();
                    truck.save();
                    return response.status(200).json({massage: "Load  posted", driver_found: true});
                })
            }
        )
        .catch((err) => {
            return response.status(500).json({massage: err});
        });

}



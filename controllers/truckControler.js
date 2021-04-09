
const Truck = require('../models/truck');

module.exports.getTrucks = (request, response) => {
    const userID = request.token.user._id;

    Truck.find({created_by: userID}, {__v: 0})
        .exec()
        .then(trucks => {
            return response.status(200).json({trucks: trucks});
        })
        .catch((err) => {
            response.status(500).json({massage: err});
        });

}

module.exports.getTrucksById = (request, response) => {
    const userID = request.token.user._id;
    const TruckId = request.params.id;


    Truck.findOne({created_by: userID, _id:TruckId }, {__v: 0})
        .exec()
        .then(trucks => {
            return response.status(200).json({truck: trucks});
        })
        .catch((err) => {
            response.status(500).json({massage: err});
        });
}

module.exports.addTruck = (request, response) => {
    const userID = request.token.user._id;
    const {type} = request.body;
    const status = "OS";
    const created_date = new Date();
    if (!type ) {
        return response.status(400).json({massage: "bad request"});
    }
    const truck = new Truck(
        {
            "created_by": userID,
            "assign_to": "null",
            type,
            status,
            created_date
        });
    truck.save()
        .then(() => {
            return response.status(200).json({massage: 'Truck created successfully'});
        })
        .catch((err) => {
            return response.status(500).json({massage: err});
        });
}

module.exports.updateTruck = (request, response) => {
    const TruckId = request.params.id;
    const newType = request.body.type;
    if(newType !=="SPRINTER"&& newType !=="SMALL STRAIGHT" && newType !=="LARGE STRAIGHT"){
        return response.status(400).json({massage: "Wrong truck type"});
    }

    Truck.findOneAndUpdate({"_id": TruckId},{"type": newType})
        .then( (oldTruckData) =>{
            if(oldTruckData){
                return response.status(200).json({massage: "Truck details changed successfully"});
            }
            return response.status(500).json({massage: "Something wrong"});
        })
        .catch( err => response.status(500).json({massage: err}));
}

module.exports.deleteTruck = (request, response) => {

    const TruckId = request.params.id;

    Truck.findOneAndDelete({"_id": TruckId})
        .then((deletedTruck) =>{
            if(deletedTruck){
                return response.status(200).json({massage: "Truck deleted successfully"});
            }
            return response.status(400).json({massage: "Cann`t find a truck"});
        })
        .catch(err  => response.status(500).json({massage: err}))
}

module.exports.assignTo = (request, response) => {
    const userId = request.token.user._id;
    const TruckId = request.params.id;
    Truck.updateOne({_id: TruckId}, {assign_to: userId, "status": "IS"})
        .exec()
        .then(truck => {
            if (!truck) {
                return response.status(400).json({massage: "Wrong truck id"});
            }
            return response.status(200).json({massage: "Truck assigned successfully"});
        })
        .catch((err) => {
            response.status(500).json({massage: err});
        });
}
module.exports.unAssign = (request, response) => {
    const userId = request.token.user._id;
    const TruckId = request.params.id;
    Truck.updateOne({_id: TruckId,"assign_to":userId}, {assign_to: "null", "status": "OS"})
        .exec()
        .then(truck => {
            if (!truck) {
                return response.status(400).json({massage: "Wrong truck id"});
            }
            return response.status(200).json({massage: "Truck unAssigned successfully"});
        })
        .catch((err) => {
            response.status(500).json({massage: err});
        });
}

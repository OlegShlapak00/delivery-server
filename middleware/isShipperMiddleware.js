const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
    const [, token] = request.headers.authorization.split(' ');
    if(jwt.decode(token).regCred.role ==="SHIPPER"){
        next();
    }
    else {
        return response.status(400).json({massage: "Only for shippers"});
    }
};

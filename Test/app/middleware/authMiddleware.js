const jwt = require('jsonwebtoken');
const httpStausCode = require('../utils/httpStatusCode');


const authCheck = async (req, res, next) => {

    let token = req?.body?.token || req?.query?.token || req?.headers?.["x-access-token"] || req?.headers?.["authorization"];
    if (!token) {
        return res.status(httpStausCode.BAD_REQUEST).json({
            success: false,
            message: "token is required"
        })
    }
    if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }
    try {
        const decoded = jwt.verify(token, process.env.Seceret_Key)
        req.admin = decoded;
    }
    catch (err) {
        console.log(err.message)
    }
    return next();
}


module.exports = authCheck;
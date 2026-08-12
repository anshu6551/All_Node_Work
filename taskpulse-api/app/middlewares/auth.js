const jwt = require("jsonwebtoken");
const httpStausCode = require("../utils/httpStatusCode");

const protect = (req, res, next) => {
  let token = req?.body?.token || req?.query?.token || req?.headers?.['x-access-token'] || req?.headers?.['authorization'];

  if (!token) {
    return res.status(httpStausCode.BAD_REQUEST).json({
      status: false,
      message: "Token Is Required For Access this url"
    });
  }

  // Safe check for string & Bearer prefix
  if (typeof token === 'string' && token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next(); // Try block ke andar hi next call karna better/safer practice hai
  } catch (err) {
    return res.status(httpStausCode.BAD_REQUEST).json({
      status: false,
      message: "Invalid Token"
    });
  }
};

module.exports = { protect }; // Changed to object export to match destructured imports!
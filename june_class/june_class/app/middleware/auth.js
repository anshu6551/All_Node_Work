exports.permitRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.roleName)) {
      return next();
    }
    return res.status(403).send("Access Denied: You do not have permission to view or modify this resource.");
  };
};

//role based authorization middleware
// usage : authorizeRoles("admin")
// authorizeRoles("lawyer", "admin")

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {      if (!req.user || !req.user.role) {
        res.status(401);
        throw new Error("Unauthorized: User not authenticated");
      } 

        if (!allowedRoles.includes(req.user.role)) {
          res.status(403);
          throw new Error("Forbidden: Insufficient permissions");
        }
        next();
      } catch (error) {
        return res.status(401).json({ message: error.message });
      }
    };
  };

export default authorizeRoles;

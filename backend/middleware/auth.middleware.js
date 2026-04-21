const { verifyToken } = require("../utils/jwt.utils");
const { sendError } = require("../utils/response.utils");
const User = require("../models/User.model");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, 401, "Access denied. No token provided.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.isActive) {
      return sendError(res, 401, "Token is invalid or user no longer exists.");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendError(res, 401, "Token has expired. Please log in again.");
    }
    return sendError(res, 401, "Invalid token.");
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, 403, `Access forbidden. Required role: ${roles.join(" or ")}.`);
    }
    next();
  };
};

module.exports = { protect, authorize };
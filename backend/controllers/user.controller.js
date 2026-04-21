const User = require("../models/User.model");
const { sendSuccess, sendError } = require("../utils/response.utils");

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(),
    ]);
    return sendSuccess(res, 200, "Users fetched successfully", {
      users,
      pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) { next(err); }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, "User not found.");
    return sendSuccess(res, 200, "User fetched successfully", { user });
  } catch (err) { next(err); }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) return sendError(res, 400, "Invalid role.");
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return sendError(res, 404, "User not found.");
    return sendSuccess(res, 200, "User role updated successfully", { user });
  } catch (err) { next(err); }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return sendError(res, 404, "User not found.");
    user.isActive = !user.isActive;
    await user.save();
    return sendSuccess(res, 200, `User ${user.isActive ? "activated" : "deactivated"} successfully`, { user });
  } catch (err) { next(err); }
};

module.exports = { getAllUsers, getUserById, updateUserRole, toggleUserStatus };
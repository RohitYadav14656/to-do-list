const User = require("../models/User.model");
const { generateToken } = require("../utils/jwt.utils");
const { sendSuccess, sendError } = require("../utils/response.utils");

const register = async (req, res, next) => {
  try {
    console.log("REGISTER BODY:", req.body); // debug
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, "Please provide name, email and password.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, "Email is already registered.");
    }

    const user = await User.create({ name, email, password });
    const token = generateToken({ id: user._id, role: user.role });

    return sendSuccess(res, 201, "Registration successful", {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const login = async (req, res, next) => {
  try {
    console.log("LOGIN BODY:", req.body); // debug
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Please provide email and password.");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 401, "Invalid email or password.");
    }

    if (!user.isActive) {
      return sendError(res, 403, "Account is deactivated.");
    }

    const token = generateToken({ id: user._id, role: user.role });

    return sendSuccess(res, 200, "Login successful", {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getMe = async (req, res) => {
  return sendSuccess(res, 200, "User fetched successfully", { user: req.user });
};

module.exports = { register, login, getMe };
const { body } = require("express-validator");

const registerValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Enter a valid email"),

  body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Enter a valid email"),

  body("password")
    .trim()
    .notEmpty().withMessage("Password is required"),
];

const taskValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Title is required")
    .isLength({ min: 3, max: 100 }).withMessage("Title must be 3–100 characters"),

  body("description")
    .optional()
    .trim(),

  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"]).withMessage("Invalid status"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
];

module.exports = { registerValidator, loginValidator, taskValidator };
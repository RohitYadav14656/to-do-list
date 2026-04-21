const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateUserRole, toggleUserStatus } = require("../controllers/user.controller");
const { protect, authorize } = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Admin only - User management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */
router.use(protect, authorize("admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id/role", updateUserRole);
router.patch("/:id/toggle-status", toggleUserStatus);

module.exports = router;
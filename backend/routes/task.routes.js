const express = require("express");
const router = express.Router();
const { createTask, getTasks, getTask, updateTask, deleteTask } = require("../controllers/task.controller");
const { protect } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");
const { taskValidator } = require("../validators");

router.use(protect);

router.route("/")
  .get(getTasks)
  .post([...taskValidator, validate, createTask]);

router.route("/:id")
  .get(getTask)
  .put([...taskValidator, validate, updateTask])
  .delete(deleteTask);

module.exports = router;
const Task = require("../models/Task.model");
const { sendSuccess, sendError } = require("../utils/response.utils");

const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, owner: req.user._id });
    return sendSuccess(res, 201, "Task created successfully", { task });
  } catch (err) { next(err); }
};

const getTasks = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const filter = req.user.role === "admin" ? {} : { owner: req.user._id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const skip = (Number(page) - 1) * Number(limit);
    const [tasks, total] = await Promise.all([
      Task.find(filter).populate("owner", "name email").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Task.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, "Tasks fetched successfully", {
      tasks,
      pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) { next(err); }
};

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate("owner", "name email");
    if (!task) return sendError(res, 404, "Task not found.");
    if (req.user.role !== "admin" && task.owner._id.toString() !== req.user._id.toString()) {
      return sendError(res, 403, "Not authorized to view this task.");
    }
    return sendSuccess(res, 200, "Task fetched successfully", { task });
  } catch (err) { next(err); }
};

const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return sendError(res, 404, "Task not found.");
    if (req.user.role !== "admin" && task.owner.toString() !== req.user._id.toString()) {
      return sendError(res, 403, "Not authorized to update this task.");
    }
    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("owner", "name email");
    return sendSuccess(res, 200, "Task updated successfully", { task });
  } catch (err) { next(err); }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return sendError(res, 404, "Task not found.");
    if (req.user.role !== "admin" && task.owner.toString() !== req.user._id.toString()) {
      return sendError(res, 403, "Not authorized to delete this task.");
    }
    await task.deleteOne();
    return sendSuccess(res, 200, "Task deleted successfully");
  } catch (err) { next(err); }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
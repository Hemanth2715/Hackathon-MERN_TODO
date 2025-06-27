const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const {
  validateCreateTask,
  validateUpdateTask,
  validateShareTask,
  validateTaskQuery,
  validateMongoId,
} = require("../middleware/validation");
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  shareTask,
  unshareTask,
  getTaskStats,
} = require("../controllers/taskController");

const router = express.Router();

// Apply authentication middleware to all task routes
router.use(authMiddleware);

// Task CRUD routes
router.get("/", validateTaskQuery, getTasks);
router.get("/stats", getTaskStats);
router.get("/:id", validateMongoId, getTask);
router.post("/", validateCreateTask, createTask);
router.put("/:id", validateUpdateTask, updateTask);
router.delete("/:id", validateMongoId, deleteTask);

// Task sharing routes
router.post("/:id/share", validateShareTask, shareTask);
router.delete("/:id/unshare", validateMongoId, unshareTask);

module.exports = router;

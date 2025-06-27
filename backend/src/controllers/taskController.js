const Task = require("../models/Task");
const User = require("../models/User");
const mongoose = require("mongoose");

// Get all tasks for the authenticated user
const getTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      isOverdue,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      priority,
      isOverdue: isOverdue === "true",
      sortBy,
      sortOrder,
    };

    let tasks = await Task.getUserTasks(req.user._id, options);

    // Apply search filter if provided
    if (search) {
      const searchRegex = new RegExp(search, "i");
      tasks = tasks.filter(
        (task) =>
          searchRegex.test(task.title) || searchRegex.test(task.description)
      );
    }

    // Get total count for pagination
    const totalQuery = {
      $or: [{ owner: req.user._id }, { "sharedWith.user": req.user._id }],
      isArchived: false,
    };

    if (status) totalQuery.status = status;
    if (priority) totalQuery.priority = priority;
    if (isOverdue === "true") {
      totalQuery.dueDate = { $lt: new Date() };
      totalQuery.status = { $ne: "completed" };
    }

    const total = await Task.countDocuments(totalQuery);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching tasks",
    });
  }
};

// Get a single task by ID
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("owner", "name email avatar")
      .populate("sharedWith.user", "name email avatar");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user has access to this task
    const hasAccess =
      task.owner._id.equals(req.user._id) ||
      task.sharedWith.some((share) => share.user._id.equals(req.user._id));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this task",
      });
    }

    res.json({
      success: true,
      data: { task },
    });
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching task",
    });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      owner: req.user._id,
    };

    const task = new Task(taskData);
    await task.save();

    await task.populate("owner", "name email avatar");

    // Emit real-time update via socket (handled in server.js)
    req.app.get("socketio").emit("taskCreated", {
      task,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating task",
    });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Check if user has edit permission
    const isOwner = task.owner.equals(req.user._id);
    const sharedUser = task.sharedWith.find((share) =>
      share.user.equals(req.user._id)
    );
    const hasEditPermission =
      isOwner || (sharedUser && sharedUser.permission === "edit");

    if (!hasEditPermission) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to edit this task",
      });
    }

    // Update task fields
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        task[key] = req.body[key];
      }
    });

    await task.save();
    await task.populate("owner", "name email avatar");
    await task.populate("sharedWith.user", "name email avatar");

    // Emit real-time update
    req.app.get("socketio").emit("taskUpdated", {
      task,
      userId: req.user._id,
    });

    res.json({
      success: true,
      message: "Task updated successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating task",
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Only owner can delete tasks
    if (!task.owner.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only the task owner can delete this task",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    // Emit real-time update
    req.app.get("socketio").emit("taskDeleted", {
      taskId: req.params.id,
      userId: req.user._id,
    });

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting task",
    });
  }
};

// Share a task with another user
const shareTask = async (req, res) => {
  try {
    const { email, permission = "read" } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Only owner can share tasks
    if (!task.owner.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only the task owner can share this task",
      });
    }

    // Find user to share with
    const userToShareWith = await User.findOne({ email });
    if (!userToShareWith) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // Check if already shared with this user
    const existingShare = task.sharedWith.find((share) =>
      share.user.equals(userToShareWith._id)
    );

    if (existingShare) {
      // Update permission
      existingShare.permission = permission;
    } else {
      // Add new share
      task.sharedWith.push({
        user: userToShareWith._id,
        permission,
        sharedAt: new Date(),
      });
    }

    await task.save();
    await task.populate("sharedWith.user", "name email avatar");

    // Emit real-time update
    req.app.get("socketio").emit("taskShared", {
      task,
      sharedWithUserId: userToShareWith._id,
      userId: req.user._id,
    });

    res.json({
      success: true,
      message: "Task shared successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Share task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while sharing task",
    });
  }
};

// Remove share from a task
const unshareTask = async (req, res) => {
  try {
    const { userId } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Only owner can unshare tasks
    if (!task.owner.equals(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Only the task owner can unshare this task",
      });
    }

    // Remove user from sharedWith array
    task.sharedWith = task.sharedWith.filter(
      (share) => !share.user.equals(userId)
    );

    await task.save();

    // Emit real-time update
    req.app.get("socketio").emit("taskUnshared", {
      taskId: req.params.id,
      unsharedUserId: userId,
      userId: req.user._id,
    });

    res.json({
      success: true,
      message: "Task unshared successfully",
      data: { task },
    });
  } catch (error) {
    console.error("Unshare task error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while unsharing task",
    });
  }
};

// Get task statistics
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Task.aggregate([
      {
        $match: {
          $or: [{ owner: userId }, { "sharedWith.user": userId }],
          isArchived: false,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
          },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ["$dueDate", new Date()] },
                    { $ne: ["$status", "completed"] },
                    { $ne: ["$dueDate", null] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const result = stats[0] || {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      overdue: 0,
    };

    res.json({
      success: true,
      data: { stats: result },
    });
  } catch (error) {
    console.error("Get task stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching task statistics",
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  shareTask,
  unshareTask,
  getTaskStats,
};

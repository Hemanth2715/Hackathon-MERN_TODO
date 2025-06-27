const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  dueDate: {
    type: Date,
    default: null,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sharedWith: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      permission: {
        type: String,
        enum: ["read", "edit"],
        default: "read",
      },
      sharedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  attachments: [
    {
      filename: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  isArchived: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
taskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Set completedAt when status changes to completed
  if (this.isModified("status") && this.status === "completed") {
    this.completedAt = Date.now();
  } else if (this.isModified("status") && this.status !== "completed") {
    this.completedAt = null;
  }

  next();
});

// Virtual for checking if task is overdue
taskSchema.virtual("isOverdue").get(function () {
  if (!this.dueDate || this.status === "completed") return false;
  return new Date() > this.dueDate;
});

// Index for efficient queries
taskSchema.index({ owner: 1, createdAt: -1 });
taskSchema.index({ "sharedWith.user": 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });

// Static method to get user's tasks (owned + shared)
taskSchema.statics.getUserTasks = function (userId, options = {}) {
  const {
    status,
    priority,
    isOverdue,
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = options;

  const query = {
    $or: [{ owner: userId }, { "sharedWith.user": userId }],
    isArchived: false,
  };

  if (status) query.status = status;
  if (priority) query.priority = priority;

  if (isOverdue === true) {
    query.dueDate = { $lt: new Date() };
    query.status = { $ne: "completed" };
  }

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

  return this.find(query)
    .populate("owner", "name email avatar")
    .populate("sharedWith.user", "name email avatar")
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

module.exports = mongoose.model("Task", taskSchema);

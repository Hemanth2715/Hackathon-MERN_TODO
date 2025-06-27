const { body, param, query, validationResult } = require("express-validator");

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

// User validation rules
const validateRegister = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  handleValidationErrors,
];

const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Task validation rules
const validateCreateTask = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ max: 200 })
    .withMessage("Task title cannot exceed 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "urgent"])
    .withMessage("Priority must be one of: low, medium, high, urgent"),
  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Status must be one of: pending, in-progress, completed"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date in ISO format")
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error("Due date cannot be in the past");
      }
      return true;
    }),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error("Cannot have more than 10 tags");
      }
      return true;
    }),
  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Each tag must be between 1 and 30 characters"),
  handleValidationErrors,
];

const validateUpdateTask = [
  param("id").isMongoId().withMessage("Invalid task ID"),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Task title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Task title cannot exceed 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "urgent"])
    .withMessage("Priority must be one of: low, medium, high, urgent"),
  body("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Status must be one of: pending, in-progress, completed"),
  body("dueDate")
    .optional()
    .custom((value) => {
      if (value === null) return true; // Allow null to clear due date
      if (!value) return true; // Allow empty string

      if (!Date.parse(value)) {
        throw new Error("Due date must be a valid date");
      }
      return true;
    }),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array")
    .custom((tags) => {
      if (tags.length > 10) {
        throw new Error("Cannot have more than 10 tags");
      }
      return true;
    }),
  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Each tag must be between 1 and 30 characters"),
  handleValidationErrors,
];

const validateShareTask = [
  param("id").isMongoId().withMessage("Invalid task ID"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("permission")
    .optional()
    .isIn(["read", "edit"])
    .withMessage("Permission must be either read or edit"),
  handleValidationErrors,
];

// Query validation
const validateTaskQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("status")
    .optional()
    .isIn(["pending", "in-progress", "completed"])
    .withMessage("Status must be one of: pending, in-progress, completed"),
  query("priority")
    .optional()
    .isIn(["low", "medium", "high", "urgent"])
    .withMessage("Priority must be one of: low, medium, high, urgent"),
  query("sortBy")
    .optional()
    .isIn(["createdAt", "updatedAt", "dueDate", "priority", "title"])
    .withMessage(
      "SortBy must be one of: createdAt, updatedAt, dueDate, priority, title"
    ),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("SortOrder must be either asc or desc"),
  query("isOverdue")
    .optional()
    .isBoolean()
    .withMessage("isOverdue must be a boolean"),
  handleValidationErrors,
];

const validateMongoId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCreateTask,
  validateUpdateTask,
  validateShareTask,
  validateTaskQuery,
  validateMongoId,
  handleValidationErrors,
};

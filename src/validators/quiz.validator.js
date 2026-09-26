const { body } = require("express-validator");

const createQuizValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Quiz title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer (in minutes)"),

  body("marksPerQuestion")
    .notEmpty()
    .withMessage("Marks per question is required")
    .isInt({ min: 1 })
    .withMessage("Marks per question must be at least 1"),

  body("negativeMarks")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Negative marks cannot be negative"),
];

const updateQuizValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Duration must be a positive integer"),

  body("marksPerQuestion")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Marks per question must be at least 1"),

  body("negativeMarks")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Negative marks cannot be negative"),
];

module.exports = { createQuizValidator, updateQuizValidator };

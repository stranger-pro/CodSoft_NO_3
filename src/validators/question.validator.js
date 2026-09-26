const { body } = require("express-validator");

const createQuestionValidator = [
  body("question")
    .trim()
    .notEmpty()
    .withMessage("Question text is required"),

  body("options")
    .isArray({ min: 2 })
    .withMessage("At least 2 options are required"),

  body("options.*.text")
    .trim()
    .notEmpty()
    .withMessage("Each option must have non-empty text"),

  body("correctOption")
    .notEmpty()
    .withMessage("Correct option is required")
    .isInt({ min: 0 })
    .withMessage("Correct option must be a non-negative integer (0-based index)"),
];

const updateQuestionValidator = [
  body("question")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Question text cannot be empty"),

  body("options")
    .optional()
    .isArray({ min: 2 })
    .withMessage("At least 2 options are required"),

  body("options.*.text")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Each option must have non-empty text"),

  body("correctOption")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Correct option must be a non-negative integer"),
];

module.exports = { createQuestionValidator, updateQuestionValidator };

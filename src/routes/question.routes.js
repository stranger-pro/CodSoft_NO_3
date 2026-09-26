const express = require("express");
const router = express.Router();

const {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/question.controller");

const { protect } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
  createQuestionValidator,
  updateQuestionValidator,
} = require("../validators/question.validator");

router.use(protect);

router.post("/quiz/:quizId", adminOnly, createQuestionValidator, validate, createQuestion);
router.get("/quiz/:quizId", getQuestions);
router.put("/:questionId", adminOnly, updateQuestionValidator, validate, updateQuestion);
router.delete("/:questionId", adminOnly, deleteQuestion);

module.exports = router;

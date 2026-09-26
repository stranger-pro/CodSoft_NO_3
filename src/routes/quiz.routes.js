const express = require("express");
const router = express.Router();

const {
  createQuiz,
  getQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
} = require("../controllers/quiz.controller");

const { protect } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");
const { validate } = require("../middlewares/validate.middleware");
const {
  createQuizValidator,
  updateQuizValidator,
} = require("../validators/quiz.validator");

router.use(protect);

router.post("/", adminOnly, createQuizValidator, validate, createQuiz);
router.get("/", getQuizzes);
router.get("/:quizId", getQuiz);
router.put("/:quizId", adminOnly, updateQuizValidator, validate, updateQuiz);
router.delete("/:quizId", adminOnly, deleteQuiz);
router.patch("/:quizId/publish", adminOnly, publishQuiz);

module.exports = router;

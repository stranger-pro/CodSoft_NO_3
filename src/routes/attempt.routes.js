const express = require("express");
const router = express.Router();

const { startQuiz, getAttempt, submitQuiz } = require("../controllers/attempt.controller");
const { protect } = require("../middlewares/auth.middleware");

router.use(protect);

router.post("/quiz/:quizId/start", startQuiz);
router.get("/:attemptId", getAttempt);
router.post("/:attemptId/submit", submitQuiz);

module.exports = router;

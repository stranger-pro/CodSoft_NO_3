const express = require("express");
const router = express.Router();

const { getMyResults, getResult, getQuizResults } = require("../controllers/result.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");

router.use(protect);

router.get("/me", getMyResults);
router.get("/:attemptId", getResult);
router.get("/quiz/:quizId", adminOnly, getQuizResults);

module.exports = router;

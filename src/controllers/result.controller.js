const Attempt = require("../models/attempt.model");
const asyncHandler = require("../utils/asyncHandler");

const getMyResults = asyncHandler(async (req, res) => {
  const attempts = await Attempt.find({ userId: req.user._id })
    .populate("quizId", "title description duration marksPerQuestion negativeMarks")
    .select("-answers")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: attempts.length,
    results: attempts,
  });
});

const getResult = asyncHandler(async (req, res) => {
  const attempt = await Attempt.findById(req.params.attemptId)
    .populate("quizId", "title description duration marksPerQuestion negativeMarks")
    .populate("answers.questionId", "question options");

  if (!attempt) {
    return res.status(404).json({ success: false, message: "Result not found" });
  }

  if (attempt.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to this result",
    });
  }

  res.status(200).json({ success: true, result: attempt });
});

const getQuizResults = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  const attempts = await Attempt.find({
    quizId,
    status: { $in: ["completed", "expired"] },
  })
    .populate("userId", "name email")
    .select("-answers")
    .sort({ score: -1, timeTaken: 1 });

  res.status(200).json({
    success: true,
    count: attempts.length,
    results: attempts,
  });
});

module.exports = { getMyResults, getResult, getQuizResults };

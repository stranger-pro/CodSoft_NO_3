const Attempt = require("../models/attempt.model");
const asyncHandler = require("../utils/asyncHandler");

const getLeaderboard = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  const leaderboard = await Attempt.find({
    quizId,
    status: "completed",
  })
    .populate("userId", "name email")
    .select("userId score correct wrong unanswered percentage timeTaken submittedAt")
    .sort({ score: -1, timeTaken: 1 });

  const ranked = leaderboard.map((entry, index) => ({
    rank: index + 1,
    user: entry.userId,
    score: entry.score,
    correct: entry.correct,
    wrong: entry.wrong,
    unanswered: entry.unanswered,
    percentage: entry.percentage,
    timeTaken: entry.timeTaken,
    submittedAt: entry.submittedAt,
  }));

  res.status(200).json({
    success: true,
    count: ranked.length,
    leaderboard: ranked,
  });
});

module.exports = { getLeaderboard };

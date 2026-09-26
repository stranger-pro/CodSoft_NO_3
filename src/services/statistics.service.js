const Attempt = require("../models/attempt.model");
const User = require("../models/user.model");
const Quiz = require("../models/quiz.model");

const getUserStatistics = async (userId) => {
  const attempts = await Attempt.find({ userId });

  const totalAttempts = attempts.length;

  const completedAttempts = attempts.filter(
    (a) => a.status === "completed" || a.status === "expired"
  );

  const completedCount = completedAttempts.length;

  if (completedCount === 0) {
    return {
      totalAttempts,
      completedAttempts: 0,
      averageScore: 0,
      highestScore: 0,
      averagePercentage: 0,
      totalCorrect: 0,
      totalWrong: 0,
      totalUnanswered: 0,
    };
  }

  const scores = completedAttempts.map((a) => a.score ?? 0);
  const percentages = completedAttempts.map((a) => a.percentage ?? 0);

  const averageScore = parseFloat(
    (scores.reduce((sum, s) => sum + s, 0) / completedCount).toFixed(2)
  );

  const highestScore = Math.max(...scores);

  const averagePercentage = parseFloat(
    (percentages.reduce((sum, p) => sum + p, 0) / completedCount).toFixed(2)
  );

  const totalCorrect = completedAttempts.reduce(
    (sum, a) => sum + (a.correct ?? 0),
    0
  );
  const totalWrong = completedAttempts.reduce(
    (sum, a) => sum + (a.wrong ?? 0),
    0
  );
  const totalUnanswered = completedAttempts.reduce(
    (sum, a) => sum + (a.unanswered ?? 0),
    0
  );

  return {
    totalAttempts,
    completedAttempts: completedCount,
    averageScore,
    highestScore,
    averagePercentage,
    totalCorrect,
    totalWrong,
    totalUnanswered,
  };
};

const getAdminStatistics = async () => {
  const [
    totalUsers,
    totalAdmins,
    totalParticipants,
    totalQuizzes,
    publishedQuizzes,
    totalAttempts,
    completedAttempts,
    expiredAttempts,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ role: "participant" }),
    Quiz.countDocuments(),
    Quiz.countDocuments({ isPublished: true }),
    Attempt.countDocuments(),
    Attempt.countDocuments({ status: "completed" }),
    Attempt.countDocuments({ status: "expired" }),
  ]);

  const scoreAgg = await Attempt.aggregate([
    { $match: { status: { $in: ["completed", "expired"] }, score: { $ne: null } } },
    { $group: { _id: null, avgScore: { $avg: "$score" } } },
  ]);

  const averageScore =
    scoreAgg.length > 0
      ? parseFloat(scoreAgg[0].avgScore.toFixed(2))
      : 0;

  return {
    totalUsers,
    totalAdmins,
    totalParticipants,
    totalQuizzes,
    publishedQuizzes,
    totalAttempts,
    completedAttempts,
    expiredAttempts,
    averageScore,
  };
};

module.exports = { getUserStatistics, getAdminStatistics };

const Quiz = require("../models/quiz.model");
const Question = require("../models/question.model");
const Attempt = require("../models/attempt.model");
const asyncHandler = require("../utils/asyncHandler");
const attemptService = require("../services/attempt.service");
const { calculateScore } = require("../services/score.service");

const startQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    return res.status(404).json({ success: false, message: "Quiz not found" });
  }

  if (!quiz.isPublished) {
    return res.status(403).json({
      success: false,
      message: "This quiz is not yet published",
    });
  }

  if (quiz.questions.length === 0) {
    return res.status(400).json({
      success: false,
      message: "This quiz has no questions yet",
    });
  }

  const existingAttempt = await Attempt.findOne({
    userId: req.user._id,
    quizId,
    status: "in-progress",
  });

  if (existingAttempt) {
    if (!attemptService.checkAttemptExpiry(existingAttempt)) {
      const questions = await Question.find({ quizId }).select(
        "question options"
      );
      return res.status(200).json({
        success: true,
        message: "Resuming existing attempt",
        attemptId: existingAttempt._id,
        startedAt: existingAttempt.startedAt,
        expiresAt: existingAttempt.expiresAt,
        questions,
      });
    }

    await Attempt.findByIdAndUpdate(existingAttempt._id, {
      status: "expired",
    });
  }

  const questions = await Question.find({ quizId }).select("question options");

  const attempt = await attemptService.createAttempt(req.user._id, quiz);

  res.status(201).json({
    success: true,
    message: "Quiz started successfully",
    attemptId: attempt._id,
    startedAt: attempt.startedAt,
    expiresAt: attempt.expiresAt,
    questions,
  });
});

const getAttempt = asyncHandler(async (req, res) => {
  const attempt = await Attempt.findById(req.params.attemptId)
    .populate("quizId", "title duration marksPerQuestion negativeMarks")
    .populate("answers.questionId", "question options");

  if (!attempt) {
    return res.status(404).json({ success: false, message: "Attempt not found" });
  }

  attemptService.checkAttemptOwnership(attempt, req.user._id);

  res.status(200).json({ success: true, attempt });
});

const submitQuiz = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const { answers } = req.body;

  const attempt = await Attempt.findById(attemptId);
  if (!attempt) {
    return res.status(404).json({ success: false, message: "Attempt not found" });
  }

  attemptService.checkAttemptOwnership(attempt, req.user._id);

  if (attempt.status === "completed") {
    return res.status(400).json({
      success: false,
      message: "This attempt has already been submitted",
    });
  }

  const isExpired = attemptService.checkAttemptExpiry(attempt);
  const finalStatus = isExpired ? "expired" : "completed";

  const quiz = await Quiz.findById(attempt.quizId);
  const questions = await Question.find({ quizId: attempt.quizId });

  if (!quiz || questions.length === 0) {
    return res.status(404).json({ success: false, message: "Quiz data not found" });
  }

  if (answers && answers.length > 0) {
    attemptService.validateAnswers(answers, questions);
  }

  const submittedAt = new Date();
  const timeTaken = attemptService.calculateTimeTaken(
    attempt.startedAt,
    submittedAt
  );

  const scoreResult = calculateScore(
    questions,
    answers || [],
    quiz.marksPerQuestion,
    quiz.negativeMarks
  );

  const updatedAttempt = await Attempt.findByIdAndUpdate(
    attemptId,
    {
      answers: answers || [],
      submittedAt,
      timeTaken,
      score: scoreResult.score,
      correct: scoreResult.correct,
      wrong: scoreResult.wrong,
      unanswered: scoreResult.unanswered,
      percentage: scoreResult.percentage,
      status: finalStatus,
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Quiz submitted successfully",
    result: {
      attemptId: updatedAttempt._id,
      score: updatedAttempt.score,
      correct: updatedAttempt.correct,
      wrong: updatedAttempt.wrong,
      unanswered: updatedAttempt.unanswered,
      totalQuestions: scoreResult.totalQuestions,
      maximumScore: scoreResult.maximumScore,
      percentage: updatedAttempt.percentage,
      timeTaken: updatedAttempt.timeTaken,
      status: updatedAttempt.status,
    },
  });
});

module.exports = { startQuiz, getAttempt, submitQuiz };

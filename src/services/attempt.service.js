const Attempt = require("../models/attempt.model");
const Quiz = require("../models/quiz.model");
const User = require("../models/user.model");

const createAttempt = async (userId, quiz) => {
  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + quiz.duration * 60 * 1000);

  const attempt = await Attempt.create({
    userId,
    quizId: quiz._id,
    answers: [],
    startedAt,
    expiresAt,
    status: "in-progress",
  });

  await User.findByIdAndUpdate(userId, {
    $push: { attempts: attempt._id },
  });

  await Quiz.findByIdAndUpdate(quiz._id, {
    $push: { attempts: attempt._id },
  });

  return attempt;
};

const validateAnswers = (answers, questions) => {
  const validQuestionIds = new Set(questions.map((q) => q._id.toString()));

  const seenQuestionIds = new Set();

  for (const answer of answers) {
    const qId = answer.questionId.toString();

    if (!validQuestionIds.has(qId)) {
      const err = new Error(
        `Question ${answer.questionId} does not belong to this quiz`
      );
      err.statusCode = 400;
      throw err;
    }

    if (seenQuestionIds.has(qId)) {
      const err = new Error(
        `Duplicate answer for question ${answer.questionId}`
      );
      err.statusCode = 400;
      throw err;
    }
    seenQuestionIds.add(qId);

    const question = questions.find((q) => q._id.toString() === qId);
    if (
      answer.selectedOption < 0 ||
      answer.selectedOption >= question.options.length
    ) {
      const err = new Error(
        `Invalid selectedOption (${answer.selectedOption}) for question ${answer.questionId}. Valid range: 0 to ${question.options.length - 1}`
      );
      err.statusCode = 400;
      throw err;
    }
  }
};

const checkAttemptOwnership = (attempt, userId) => {
  if (attempt.userId.toString() !== userId.toString()) {
    const err = new Error("You do not have access to this attempt");
    err.statusCode = 403;
    throw err;
  }
};

const checkAttemptExpiry = (attempt) => {
  return Date.now() > new Date(attempt.expiresAt).getTime();
};

const calculateTimeTaken = (startedAt, submittedAt) => {
  return Math.floor(
    (new Date(submittedAt).getTime() - new Date(startedAt).getTime()) / 1000
  );
};

module.exports = {
  createAttempt,
  validateAnswers,
  checkAttemptOwnership,
  checkAttemptExpiry,
  calculateTimeTaken,
};

const Question = require("../models/question.model");
const Quiz = require("../models/quiz.model");
const asyncHandler = require("../utils/asyncHandler");

const createQuestion = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const { question, options, correctOption } = req.body;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    return res.status(404).json({ success: false, message: "Quiz not found" });
  }

  if (correctOption >= options.length || correctOption < 0) {
    return res.status(400).json({
      success: false,
      message: `correctOption (${correctOption}) must be a valid index between 0 and ${options.length - 1}`,
    });
  }

  const newQuestion = await Question.create({
    quizId,
    question,
    options,
    correctOption,
  });

  await Quiz.findByIdAndUpdate(quizId, {
    $push: { questions: newQuestion._id },
  });

  res.status(201).json({
    success: true,
    message: "Question created successfully",
    question: newQuestion,
  });
});

const getQuestions = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    return res.status(404).json({ success: false, message: "Quiz not found" });
  }

  if (req.user.role !== "admin" && !quiz.isPublished) {
    return res.status(404).json({ success: false, message: "Quiz not found" });
  }

  const fields =
    req.user.role === "admin"
      ? "question options correctOption quizId createdAt"
      : "question options";

  const questions = await Question.find({ quizId }).select(fields);

  res.status(200).json({
    success: true,
    count: questions.length,
    questions,
  });
});

const updateQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.questionId);

  if (!question) {
    return res.status(404).json({ success: false, message: "Question not found" });
  }

  const { question: questionText, options, correctOption } = req.body;

  const effectiveOptions = options ?? question.options;
  const effectiveCorrectOption = correctOption ?? question.correctOption;

  if (
    effectiveCorrectOption < 0 ||
    effectiveCorrectOption >= effectiveOptions.length
  ) {
    return res.status(400).json({
      success: false,
      message: `correctOption (${effectiveCorrectOption}) is out of range for ${effectiveOptions.length} options`,
    });
  }

  if (questionText !== undefined) question.question = questionText;
  if (options !== undefined) question.options = options;
  if (correctOption !== undefined) question.correctOption = correctOption;

  await question.save();

  res.status(200).json({
    success: true,
    message: "Question updated successfully",
    question,
  });
});

const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.questionId);

  if (!question) {
    return res.status(404).json({ success: false, message: "Question not found" });
  }

  await Quiz.findByIdAndUpdate(question.quizId, {
    $pull: { questions: question._id },
  });

  await question.deleteOne();

  res.status(200).json({
    success: true,
    message: "Question deleted successfully",
  });
});

module.exports = { createQuestion, getQuestions, updateQuestion, deleteQuestion };

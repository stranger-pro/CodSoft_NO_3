const Quiz = require("../models/quiz.model");
const Question = require("../models/question.model");
const asyncHandler = require("../utils/asyncHandler");

const createQuiz = asyncHandler(async (req, res) => {
  const { title, description, duration, marksPerQuestion, negativeMarks } =
    req.body;

  const quiz = await Quiz.create({
    title,
    description,
    duration,
    marksPerQuestion,
    negativeMarks: negativeMarks ?? 0,
    createdBy: req.user._id,
    questions: [],
    attempts: [],
    isPublished: false,
  });

  res.status(201).json({
    success: true,
    message: "Quiz created successfully",
    quiz,
  });
});

const getQuizzes = asyncHandler(async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { isPublished: true };

  const quizzes = await Quiz.find(filter)
    .populate("createdBy", "name email")
    .select("-questions -attempts")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: quizzes.length,
    quizzes,
  });
});

const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId)
    .populate("createdBy", "name email")
    .populate("questions", "question options");

  if (!quiz) {
    return res.status(404).json({ success: false, message: "Quiz not found" });
  }

  if (req.user.role !== "admin" && !quiz.isPublished) {
    return res.status(404).json({ success: false, message: "Quiz not found" });
  }

  res.status(200).json({ success: true, quiz });
});

const updateQuiz = asyncHandler(async (req, res) => {
  const allowed = ["title", "description", "duration", "marksPerQuestion", "negativeMarks"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const quiz = await Quiz.findByIdAndUpdate(
    req.params.quizId,
    updates,
    { new: true, runValidators: true }
  );

  if (!quiz) {
    return res.status(404).json({ success: false, message: "Quiz not found" });
  }

  res.status(200).json({ success: true, message: "Quiz updated successfully", quiz });
});

const deleteQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);

  if (!quiz) {
    return res.status(404).json({ success: false, message: "Quiz not found" });
  }

  await Question.deleteMany({ quizId: quiz._id });

  await quiz.deleteOne();

  res.status(200).json({ success: true, message: "Quiz and its questions deleted successfully" });
});

const publishQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizId);

  if (!quiz) {
    return res.status(404).json({ success: false, message: "Quiz not found" });
  }

  if (!quiz.isPublished && quiz.questions.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Cannot publish a quiz with no questions",
    });
  }

  quiz.isPublished = !quiz.isPublished;
  await quiz.save();

  res.status(200).json({
    success: true,
    message: `Quiz ${quiz.isPublished ? "published" : "unpublished"} successfully`,
    isPublished: quiz.isPublished,
  });
});

module.exports = { createQuiz, getQuizzes, getQuiz, updateQuiz, deleteQuiz, publishQuiz };

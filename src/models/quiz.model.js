const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },

    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 minute"],
    },

    marksPerQuestion: {
      type: Number,
      required: [true, "Marks per question is required"],
      min: [1, "Marks per question must be at least 1"],
    },

    negativeMarks: {
      type: Number,
      required: [true, "Negative marks field is required"],
      min: [0, "Negative marks cannot be negative"],
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    attempts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attempt",
      },
    ],

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;

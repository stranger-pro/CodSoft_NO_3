const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: [true, "Quiz ID is required"],
    },

    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selectedOption: {
          type: Number,
          required: true,
        },
      },
    ],

    startedAt: {
      type: Date,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    submittedAt: {
      type: Date,
    },

    timeTaken: {
      type: Number,
      default: null,
    },

    score: {
      type: Number,
      default: null,
    },

    correct: {
      type: Number,
      default: null,
    },

    wrong: {
      type: Number,
      default: null,
    },

    unanswered: {
      type: Number,
      default: null,
    },

    percentage: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: ["in-progress", "completed", "expired"],
      default: "in-progress",
    },
  },
  {
    timestamps: true,
  }
);

const Attempt = mongoose.model("Attempt", attemptSchema);
module.exports = Attempt;

const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: [true, "Quiz ID is required"],
    },

    question: {
      type: String,
      required: [true, "Question text is required"],
      trim: true,
    },

    options: [
      {
        text: {
          type: String,
          required: [true, "Option text is required"],
          trim: true,
        },
      },
    ],

    correctOption: {
      type: Number,
      required: [true, "Correct option is required"],
      min: [0, "Correct option index must be >= 0"],
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.pre("save", function () {
  if (this.options.length < 2) {
    throw new Error("A question must have at least 2 options");
  }
  if (this.correctOption >= this.options.length) {
    throw new Error(
      `correctOption (${this.correctOption}) exceeds options length (${this.options.length})`
    );
  }
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;

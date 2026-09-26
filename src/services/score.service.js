const calculateScore = (questions, answers, marksPerQuestion, negativeMarks) => {
  const totalQuestions = questions.length;

  const correctAnswerMap = {};
  for (const q of questions) {
    correctAnswerMap[q._id.toString()] = q.correctOption;
  }

  const submittedAnswerMap = {};
  for (const ans of answers) {
    submittedAnswerMap[ans.questionId.toString()] = ans.selectedOption;
  }

  let correct = 0;
  let wrong = 0;

  for (const q of questions) {
    const qId = q._id.toString();
    const correctOpt = correctAnswerMap[qId];

    if (submittedAnswerMap[qId] === undefined) {
      continue;
    }

    if (submittedAnswerMap[qId] === correctOpt) {
      correct++;
    } else {
      wrong++;
    }
  }

  const unanswered = totalQuestions - correct - wrong;

  const score = correct * marksPerQuestion - wrong * negativeMarks;

  const maximumScore = totalQuestions * marksPerQuestion;

  const percentage =
    maximumScore > 0
      ? Math.max(0, parseFloat(((score / maximumScore) * 100).toFixed(2)))
      : 0;

  return {
    score: Math.max(0, score),
    correct,
    wrong,
    unanswered,
    percentage,
    maximumScore,
    totalQuestions,
  };
};

module.exports = { calculateScore };

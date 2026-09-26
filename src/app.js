const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const quizRoutes = require("./routes/quiz.routes");
const questionRoutes = require("./routes/question.routes");
const attemptRoutes = require("./routes/attempt.routes");
const resultRoutes = require("./routes/result.routes");
const leaderboardRoutes = require("./routes/leaderboard.routes");
const statisticsRoutes = require("./routes/statistics.routes");

const { errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Quiz API is running " });
});

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/leaderboards", leaderboardRoutes);
app.use("/api/statistics", statisticsRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

module.exports = app;

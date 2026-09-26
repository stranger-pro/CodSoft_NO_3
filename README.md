# Online Quiz System — Backend API

A production-ready RESTful API for an online quiz platform built with **Node.js**, **Express**, **MongoDB**, and **Mongoose**.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | HTTP framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| cookie-parser | HTTP-only cookie parsing |
| helmet | Security headers |
| cors | Cross-Origin Resource Sharing |
| express-validator | Input validation |
| express-rate-limit | Rate limiting |
| nodemon | Dev auto-restart |

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── quiz.controller.js
│   │   ├── question.controller.js
│   │   ├── attempt.controller.js
│   │   ├── result.controller.js
│   │   ├── leaderboard.controller.js
│   │   └── statistics.controller.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── quiz.model.js
│   │   ├── question.model.js
│   │   └── attempt.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── quiz.routes.js
│   │   ├── question.routes.js
│   │   ├── attempt.routes.js
│   │   ├── result.routes.js
│   │   ├── leaderboard.routes.js
│   │   └── statistics.routes.js
│   ├── middlewares/
│   │   ├── auth.middleware.js      # JWT verification → req.user
│   │   ├── admin.middleware.js     # Role guard
│   │   ├── error.middleware.js     # Global error handler
│   │   └── validate.middleware.js  # express-validator runner
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── quiz.validator.js
│   │   └── question.validator.js
│   ├── services/
│   │   ├── score.service.js        # Pure score calculation
│   │   ├── attempt.service.js      # Attempt lifecycle logic
│   │   └── statistics.service.js   # Aggregation logic
│   ├── utils/
│   │   ├── generateToken.js        # JWT + cookie helper
│   │   └── asyncHandler.js         # try/catch wrapper
│   ├── app.js                      # Express app setup
│   └── server.js                   # Entry point
├── .env
├── .gitignore
└── package.json
```

---

## Setup

### 1. Clone and install

```bash
cd backend
npm install
```

### 2. Configure environment

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/quiz_db
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Run development server

```bash
npm run dev
```

### 4. Health check

```
GET http://localhost:5000/api/health
```

---

## Complete API Reference

### AUTH

| Method | Endpoint | Auth | Role |
|---|---|---|---|
| POST | `/api/auth/register` | ✅ | Any |
| POST | `/api/auth/login` | ✅ | Any |
| POST | `/api/auth/logout` | ✅ | Any |
| GET | `/api/auth/me` | ✅ | Any |

### QUIZ

| Method | Endpoint | Auth | Role |
|---|---|---|---|
| POST | `/api/quizzes` | ✅ | Admin |
| GET | `/api/quizzes` | ✅ | Any |
| GET | `/api/quizzes/:quizId` | ✅ | Any |
| PUT | `/api/quizzes/:quizId` | ✅ | Admin |
| DELETE | `/api/quizzes/:quizId` | ✅ | Admin |
| PATCH | `/api/quizzes/:quizId/publish` | ✅ | Admin |

### QUESTION

| Method | Endpoint | Auth | Role |
|---|---|---|---|
| POST | `/api/quizzes/:quizId/questions` | ✅ | Admin |
| GET | `/api/quizzes/:quizId/questions` | ✅ | Any |
| PUT | `/api/questions/:questionId` | ✅ | Admin |
| DELETE | `/api/questions/:questionId` | ✅ | Admin |

### ATTEMPT

| Method | Endpoint | Auth | Role |
|---|---|---|---|
| POST | `/api/quizzes/:quizId/start` | ✅ | Any |
| GET | `/api/attempts/:attemptId` | ✅ | Any |
| POST | `/api/attempts/:attemptId/submit` | ✅ | Any |

### RESULT

| Method | Endpoint | Auth | Role |
|---|---|---|---|
| GET | `/api/results/me` | ✅ | Any |
| GET | `/api/results/:attemptId` | ✅ | Any |
| GET | `/api/quizzes/:quizId/results` | ✅ | Admin |

### LEADERBOARD

| Method | Endpoint | Auth | Role |
|---|---|---|---|
| GET | `/api/quizzes/:quizId/leaderboard` | ✅ | Any |

### STATISTICS

| Method | Endpoint | Auth | Role |
|---|---|---|---|
| GET | `/api/statistics/me` | ✅ | Any |
| GET | `/api/statistics/admin` | ✅ | Admin |

---

## Key Design Decisions

### Score is always calculated server-side
Frontend sends only `questionId + selectedOption`. The backend fetches the correct answers from the database and computes:
```
score = (correct × marksPerQuestion) - (wrong × negativeMarks)
percentage = (score / maximumScore) × 100
```

### Timer is authoritative on the backend
Only `startedAt` and `expiresAt` are stored. The frontend displays `expiresAt - now`. On submission, if `now > expiresAt`, the attempt is marked `expired` but the score is still calculated.

### No separate Result collection
The `Attempt` document itself stores the final result. After submission, it contains `score`, `correct`, `wrong`, `unanswered`, `percentage`, `timeTaken`, and `status: "completed"`.

### correctOption is never exposed to participants
The `GET /api/quizzes/:quizId/questions` endpoint uses MongoDB projection to exclude `correctOption` for participants. Only admins receive it.

### Duplicate submission prevention
```js
if (attempt.status === "completed") → 400 Bad Request
```

---

## Security Checklist

- [x] Passwords hashed with bcrypt (12 rounds)
- [x] JWT stored in HTTP-only, SameSite=strict cookie
- [x] `correctOption` never sent to participants
- [x] Score always calculated server-side
- [x] Attempt ownership verified before any access
- [x] Duplicate submission blocked
- [x] All inputs validated with express-validator
- [x] Admin routes protected with role middleware
- [x] Helmet security headers
- [x] CORS configured with allowed origins
- [x] Auth endpoint rate limited (20 req / 15 min)
- [x] General API rate limited (200 req / 15 min)
- [x] Password excluded from all query responses (`select: false`)

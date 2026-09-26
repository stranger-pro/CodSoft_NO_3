const express = require("express");
const router = express.Router();

const { register, login, logout, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const { validate } = require("../middlewares/validate.middleware");
const { registerValidator, loginValidator } = require("../validators/auth.validator");

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.post("/logout", logout);

router.get("/me", protect, getMe);

module.exports = router;

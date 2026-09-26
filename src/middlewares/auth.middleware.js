const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Please log in.",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or has expired. Please log in again.",
    });
  }

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User belonging to this token no longer exists.",
    });
  }

  req.user = user;
  next();
});

module.exports = { protect };

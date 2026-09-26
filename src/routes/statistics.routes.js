const express = require("express");
const router = express.Router();

const { getMyStatistics, getAdminStatistics } = require("../controllers/statistics.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");

router.get("/me", protect, getMyStatistics);
router.get("/admin", protect, adminOnly, getAdminStatistics);

module.exports = router;

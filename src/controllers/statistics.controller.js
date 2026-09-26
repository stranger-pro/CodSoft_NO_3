const asyncHandler = require("../utils/asyncHandler");
const statisticsService = require("../services/statistics.service");

const getMyStatistics = asyncHandler(async (req, res) => {
  const stats = await statisticsService.getUserStatistics(req.user._id);

  res.status(200).json({
    success: true,
    statistics: stats,
  });
});

const getAdminStatistics = asyncHandler(async (req, res) => {
  const stats = await statisticsService.getAdminStatistics();

  res.status(200).json({
    success: true,
    statistics: stats,
  });
});

module.exports = { getMyStatistics, getAdminStatistics };

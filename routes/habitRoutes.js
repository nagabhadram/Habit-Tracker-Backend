const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createHabit,
  getHabits,
  deleteHabit,
  checkInHabit,
  getWeeklyStats,
  getMonthlyStats,
} = require("../controllers/habitController");

router.get("/stats/weekly", protect, getWeeklyStats);
router.get("/stats/monthly", protect, getMonthlyStats);


// Protected routes
router.post("/", protect, createHabit);
router.get("/", protect, getHabits);
router.put("/:id/checkin", protect, checkInHabit);
router.delete("/:id", protect, deleteHabit);

module.exports = router;

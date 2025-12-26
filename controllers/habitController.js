const db = require("../config/database");

// CREATE HABIT
exports.createHabit = (req, res, next) => {
  try {
    const { title, category, frequency, goal } = req.body;

    if (!title || !frequency) {
      res.status(400);
      throw new Error("Title and frequency are required");
    }

    const result = db
      .prepare(
        `INSERT INTO habits 
         (user_id, title, category, frequency, goal)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(
        req.user.id,
        title,
        category || "",
        frequency,
        goal || 1
      );

    res.status(201).json({
      id: result.lastInsertRowid,
      title,
      category,
      frequency,
      goal,
    });
  } catch (error) {
    next(error);
  }
};

// GET USER HABITS
exports.getHabits = (req, res, next) => {
  try {
    const habits = db
      .prepare("SELECT * FROM habits WHERE user_id = ?")
      .all(req.user.id);

    res.json(habits);
  } catch (error) {
    next(error);
  }
};

// DELETE HABIT
exports.deleteHabit = (req, res, next) => {
  try {
    db.prepare(
      "DELETE FROM habits WHERE id = ? AND user_id = ?"
    ).run(req.params.id, req.user.id);

    res.json({ message: "Habit deleted" });
  } catch (error) {
    next(error);
  }
};

// CHECK-IN HABIT
exports.checkInHabit = (req, res, next) => {
  try {
    const { id } = req.params;
    const today = new Date().toISOString().split("T")[0];

    // Increment streak
    const result = db
      .prepare(
        "UPDATE habits SET streak = streak + 1 WHERE id = ? AND user_id = ?"
      )
      .run(id, req.user.id);

    if (result.changes === 0) {
      res.status(404);
      throw new Error("Habit not found");
    }

    // Insert habit log
    db.prepare(
      "INSERT INTO habit_logs (habit_id, user_id, date) VALUES (?, ?, ?)"
    ).run(id, req.user.id, today);

    res.json({ message: "Habit checked in" });
  } catch (error) {
    next(error);
  }
};

exports.getWeeklyStats = (req, res, next) => {
  try {
    const rows = db.prepare(`
      SELECT date, COUNT(*) as count
      FROM habit_logs
      WHERE user_id = ?
        AND date >= date('now', '-6 days')
      GROUP BY date
      ORDER BY date
    `).all(req.user.id);

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.getMonthlyStats = (req, res, next) => {
  try {
    const rows = db.prepare(`
      SELECT date, COUNT(*) as count
      FROM habit_logs
      WHERE user_id = ?
        AND date >= date('now', '-29 days')
      GROUP BY date
      ORDER BY date
    `).all(req.user.id);

    res.json(rows);
  } catch (error) {
    next(error);
  }
};


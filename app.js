const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("HabitFlow API Running");
});

app.use("/api/habits", require("./routes/habitRoutes"));

app.use("/api/auth", require("./routes/authRoutes"));

app.use(errorHandler);

module.exports = app;

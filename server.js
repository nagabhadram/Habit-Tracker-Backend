const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");

// DB auto-initializes when imported
require("./config/database");

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

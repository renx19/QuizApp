const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const questionsRouter = require("./routes/data");
const path = require("path");

// Use path.join to get the folder path
const JSON_DIR = path.resolve(process.cwd(), "json");



dotenv.config();
const app = express();

const FRONTEND_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:5174",
];

app.use(cors({ origin: FRONTEND_ORIGINS, credentials: true }));
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Quiz App API!", status: "API is running" });
});

// Use the questions router
app.use("/questions", questionsRouter);
app.use("/data", express.static(JSON_DIR));


// Start locally if not serverless

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Export for serverless
// module.exports = app;
// module.exports.handler = (req, res) => app(req, res);



const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const questionsRouter = require("./routes/data");

dotenv.config();
const app = express();

const FRONTEND_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:5173",
];

app.use(cors({ origin: FRONTEND_ORIGINS, credentials: true }));
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Quiz App API!", status: "API is running" });
});

// Use the questions router
app.use("/questions", questionsRouter);

// Start locally if not serverless

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Export for serverless
// module.exports = app;
// module.exports.handler = (req, res) => app(req, res);



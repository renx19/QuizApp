const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

const FRONTEND_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:5173",
];
const JSON_DIR = process.env.JSON_DIR || path.join(__dirname, "json");

// Middleware
app.use(cors({ origin: FRONTEND_ORIGINS, credentials: true }));
app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Quiz App API!", status: "API is running" });
});

// Static JSON
app.use("/data", express.static(JSON_DIR));

// Questions endpoint
app.get("/questions", (req, res) => {
  const subject = req.query.subject;
  const subjects = {
    "Clinical Chemistry": "ClinicalChemistry.json",
    "Clinical Microscopy": "ClinicalMicroscopy.json",
    IBSS: "IBSS.json",
    Hematology: "Hematology.json",
    "Medtech Laws": "MedtechLaws.json",
    Microbiology: "Microbiology.json",
  };

  const fileName = subjects[subject];
  if (!fileName) return res.status(404).json({ error: "Subject not found" });

  const filePath = path.join(JSON_DIR, fileName);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to load questions" });
    }
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${port}`);
});
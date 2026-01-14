// routes/questions.js
const express = require("express");
const path = require("path");
const router = express.Router();

// Directory for JSON files
const JSON_DIR = process.env.JSON_DIR || path.join(__dirname, "../json");

// Serve static JSON files (optional, if you want direct /data access)
router.use("/data", express.static(JSON_DIR));

// /questions endpoint
router.get("/", (req, res) => {
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

module.exports = router;

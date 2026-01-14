const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const JSON_DIR = path.resolve(process.cwd(), "json");

router.get("/", (req, res) => {
  let subject = req.query.subject;

  if (!subject) {
    return res.status(400).json({ error: "Subject is required" });
  }

  subject = decodeURIComponent(subject)
    .replace(/\+/g, " ")
    .toLowerCase()
    .trim();

  const subjects = {
    "clinical chemistry": "ClinicalChemistry.json",
    "clinical microscopy": "ClinicalMicroscopy.json",
    ibss: "IBSS.json",
    hematology: "Hematology.json",
    "medtech laws": "MedtechLaws.json",
    microbiology: "Microbiology.json",
  };

  const fileName = subjects[subject];
  if (!fileName) {
    return res.status(404).json({ error: "Subject not found", received: subject });
  }

  const filePath = path.join(JSON_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(500).json({
      error: "JSON file missing in production",
      file: fileName,
    });
  }

  res.sendFile(filePath);
});

module.exports = router;

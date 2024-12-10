const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');



app.use(cors({
    origin: 'http://localhost:5173', // Frontend origin
    credentials: true, // Allow cookies to be sent
}));



// Serve static files from the "json" directory
app.use('/data', express.static(path.join(__dirname, 'json')));

// Dynamic endpoint to serve questions for a specific subject
app.get('/questions', (req, res) => {
    const subject = req.query.subject; // Example: /questions?subject=Clinical Chemistry

    const subjects = {
        'Clinical Chemistry': 'ClinicalChemistry.json',
        'Clinical Microscopy': 'ClinicalMicroscopy.json',
        'IBSS': 'IBSS.json',
        'Hematology': 'Hematology.json',
        'Medtech Laws': 'MedtechLaws.json',
        'Microbiology': 'Microbiology.json',
    };

    const fileName = subjects[subject];

    if (!fileName) {
        return res.status(404).json({ error: 'Subject not found' });
    }

    const filePath = path.join(__dirname, 'json', fileName);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to load questions' });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
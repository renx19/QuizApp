const express = require('express');
const path = require('path');
const https = require('https');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();


const allowedOrigins = process.env.ALLOWED_ORIGINS ?
    process.env.ALLOWED_ORIGINS.split(',') : [];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// Keep-alive function to ping the server
const keepAlive = () => {
    const url = 'https://quiz-app-api-smye.onrender.com'; // URL for your Render app

    https.get(url, (res) => {
        console.log('Keep-alive ping successful', res.statusCode);
    }).on('error', (e) => {
        console.error('Keep-alive ping failed', e);
    });
};

// Set up keep-alive interval (every 5 minutes)
setInterval(keepAlive, 5 * 60 * 1000);

// Enable CORS for your frontend
// app.use(cors({
//     origin: [
//         'http://localhost:5173', // Local frontend
//         'https://quizapp-nzt2.onrender.com' // Production frontend
//     ],
//     credentials: true, // Allow cookies to be sent
// }));


// API root entry point for welcome message
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Quiz App API!',
        status: 'API is running',
    });
});

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
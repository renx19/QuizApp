// utils/loadQuestions.js
import ClinicalChemistry from '../data/ClinicalChemistry.json';
import ClinicalMicroscopy from '../data/ClinicalMicroscopy.json';
import IBSS from '../data/IBSS.json';
import Hematology from '../data/Hematology.json';
import MedtechLaws from '../data/MedtechLaws.json';
import Microbiology from '../data/Microbiology.json';

export const loadQuestions = (subject) => {
    // Mapping subject names to their respective JSON data
    const subjects = {
        'Clinical Chemistry': ClinicalChemistry.exam.questions,
        'Clinical Microscopy': ClinicalMicroscopy.exam.questions,
        'IBSS': IBSS.exam.questions,
        'Hematology': Hematology.exam.questions,
        'Medtech Laws': MedtechLaws.exam.questions,
        'Microbiology': Microbiology.exam.questions,
    };

    // Return questions for the given subject
    const questions = subjects[subject] || [];

    // Extracting relevant information for each question
    const extractedQuestions = questions.map((question) => ({
        id: question.id,
        type: question.type,
        questionText: question.question,
        options: question.options,
        correctAnswer: question.answer,
        explanation: question.explanation,
    }));

    return extractedQuestions;
};
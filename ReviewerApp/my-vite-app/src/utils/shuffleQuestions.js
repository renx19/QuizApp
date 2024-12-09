/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} - The shuffled array.
 */
const shuffleArray = (array) => {
    const shuffled = [...array]; // Create a copy of the array
    console.log("Before Shuffle (Copy):", shuffled);
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    console.log("After Shuffle:", shuffled);
    return shuffled;
};

/**
 * Shuffles the questions array.
 * @param {Array} questions - The array of questions to shuffle.
 * @returns {Array} - The shuffled array.
 */
export const processQuestions = (questions) => {
    console.log("Original Questions Input:", questions);

    const shuffledQuestions = shuffleArray(questions); // Always shuffle the array
    console.log("Shuffled Questions Output:", shuffledQuestions);
    return shuffledQuestions;
};
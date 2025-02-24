import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios'; // Import Axios to make API calls
import { processQuestions } from '../utils/shuffleQuestions'; // Shuffle function

const API_URL = import.meta.env.VITE_QUIZ_API_URL;
export const useQuizStore = create(
    persist(
        (set, get) => ({
            // Existing states remain unchanged...
            quizSettings: null,
            currentPage: 1,
            answers: {},
            expanded: {},
            questions: [],
            isQuizStarted: false,
            isQuizCompleted: false,
            selectedAnswers: {},
            correctAnswers: {},
            quizType: {},

            // Actions to modify state
            setQuizSettings: (newSettings) =>
                set(() => ({
                    quizSettings: newSettings,
                })),
            setCurrentPage: (page) => set({ currentPage: page }),
            setAnswers: (newAnswers) => set({ answers: newAnswers }),
            setExpanded: (newExpanded) => set({ expanded: newExpanded }),
            setQuestions: (newQuestions) => set({ questions: newQuestions }),
            setIsQuizStarted: (isStarted) => set({ isQuizStarted: isStarted }),
            setIsQuizCompleted: (isCompleted) => set({ isQuizCompleted: isCompleted }),
            setQuizType: (newType) => set({ quizType: newType }),

            resetQuiz: () =>
                set({
                    quizSettings: null,
                    currentPage: 1,
                    answers: {},
                    expanded: {},
                    isQuizStarted: false,
                    isQuizCompleted: false,
                    selectedAnswers: {},
                    correctAnswers: {},
                    quizType: {},
                }),

            // Fetch questions based on selected subject from API
            fetchQuestions: async (subject) => {
                const { quizSettings } = get(); // Get current quizSettings from state

                try {
                    // Make the API call to fetch questions for the subject
                    const response = await axios.get(`${API_URL}/questions`, {
                        params: { subject },
                        withCredentials: true, // Ensure cookies are sent if needed
                    });

                    const allQuestions = response.data.exam?.questions || [];

                    // Check if 'questions' is an array
                    if (!Array.isArray(allQuestions)) {
                        console.error('Expected an array of questions but received:', allQuestions);
                        return;
                    }

                    // Filter questions based on quiz type
                    const selectedType = quizSettings?.quizType;
                    console.log('Selected Type:', selectedType);
                    console.log('All Questions Types:', allQuestions.map((q) => q.type));

                    const filteredQuestions = selectedType
                        ? allQuestions.filter((question) => question.type === selectedType)
                        : allQuestions;

                    console.log('Filtered Questions:', filteredQuestions);

                    // Check if shuffling is enabled
                    const isShuffleEnabled = quizSettings?.isShuffled === true || quizSettings?.isShuffled === 'True';

                    // Shuffle if enabled
                    const processedQuestions = isShuffleEnabled
                        ? processQuestions(filteredQuestions)
                        : [...filteredQuestions];

                    // Map the raw questions to include the correct questionText property
                    const mappedQuestions = processedQuestions.map((question) => ({
                        id: question.id,
                        type: question.type,
                        questionText: question.question, // Assuming 'question' is the property in the API
                        options: question.options,
                        correctAnswer: question.answer,
                        explanation: question.explanation,
                    }));

                    // Update state with processed questions
                    set({ questions: mappedQuestions });

                    // Set correct answers
                    const correctAnswers = mappedQuestions.reduce((acc, question) => {
                        acc[question.id] = question.correctAnswer; // Assuming `correctAnswer` is in your question
                        return acc;
                    }, {});

                    set({ correctAnswers });
                } catch (error) {
                    console.error('Error fetching questions:', error);
                }
            },

        }),
        {
            name: 'quiz-store', // Name of the persisted state in sessionStorage
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);


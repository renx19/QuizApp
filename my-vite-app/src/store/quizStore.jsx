import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { loadQuestions } from '../utils/loadQuestions'; // Import utility function
import { processQuestions } from '../utils/shuffleQuestions'; // Import the shuffle function

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

            // Fetch questions based on selected subject
            // Fetch questions based on selected subject
            fetchQuestions: async (subject) => {
                const { quizSettings } = get(); // Get current quizSettings from state

                // Load questions for the selected subject
                const allQuestions = loadQuestions(subject);

                // Filter questions based on type
                const selectedType = quizSettings?.quizType;
                console.log('Selected Type:', selectedType);
                console.log('All Questions Types:', allQuestions.map((q) => q.type));

                const filteredQuestions = selectedType
                    ? allQuestions.filter((question) => {
                        console.log('Question Type:', question.type);  // Log question type
                        return question.type === selectedType;
                    })
                    : allQuestions;

                console.log('Filtered Questions:', filteredQuestions);  // Log filtered questions


                // Check if shuffling is enabled
                const isShuffleEnabled = quizSettings?.isShuffled === true || quizSettings?.isShuffled === 'True';

                // Shuffle if enabled
                const processedQuestions = isShuffleEnabled ? processQuestions(filteredQuestions) : [...filteredQuestions];

                // Update state with processed questions
                set({ questions: processedQuestions });

                // Set correct answers
                const correctAnswers = processedQuestions.reduce((acc, question) => {
                    acc[question.id] = question.correctAnswer; // Use `correctAnswer` as defined in `loadQuestions`
                    return acc;
                }, {});

                set({ correctAnswers });
            },


        }),
        {
            name: 'quiz-store', // Name of the persisted state in sessionStorage
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);


import { Box, TextField, Autocomplete, Button, Grid, Card, CardContent, Pagination, useTheme, Collapse, Typography, IconButton } from '@mui/material';
import { useQuizStore } from '../store/quizStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../quiz.css';
import { useColorMode } from "../theme/ThemeProvider";
import { Brightness4, Brightness7 } from '@mui/icons-material';

const QuizPanel = () => {
    const {
        quizSettings,
        currentPage,
        answers,
        questions,
        isQuizStarted,
        isQuizCompleted,
        setQuizSettings,
        setCurrentPage,
        setAnswers,
        setIsQuizStarted,
        setIsQuizCompleted,
        resetQuiz,


        fetchQuestions,
    } = useQuizStore();

    const theme = useTheme();
    const toggleColorMode = useColorMode(); // Access the toggle function
    const currentMode = useColorMode(); // To check the current mode if needed

    const numberOptions = ['10', '20', '30', '40', '50', '100', '200', '300', '400', '500'];
    const subjects = ['Clinical Chemistry', 'Clinical Microscopy', 'IBSS', 'Hematology', 'Medtech Laws', 'Microbiology'];
    const quizTypes = [
        { label: 'Multiple Choice', value: 'multiple_choice' },
        { label: 'True/False', value: 'true_false' },
    ];
    const shuffleOptions = ['True', 'False'];
    const answerDisplayOptions = ['After Each Question', 'After Quiz'];

    const questionsPerPage = 10;
    const totalQuestions = Math.min(questions.length, Number(quizSettings?.questions) || 0);
    const totalPages = Math.ceil(totalQuestions / questionsPerPage);
    const currentQuestions = questions
        .slice(0, totalQuestions)
        .slice((currentPage - 1) * questionsPerPage, currentPage * questionsPerPage);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleAnswerChange = (questionId, value) => {
        setAnswers({ ...answers, [questionId]: value });
    };

    const handleStartQuiz = () => {
        const { subject, quizType, questions } = quizSettings || {};
        if (!subject || !quizType || !questions) {
            toast.error('Please fill in all fields before starting the quiz.');
        } else {
            setIsQuizStarted(true);
            fetchQuestions(subject);
            toast.success('Quiz started! Good luck!');
        }
    };

    const handleSubmitQuiz = () => {
        setIsQuizStarted(false); // End the quiz                                
        setIsQuizCompleted(true); // Mark quiz as completed
        toast.success('Quiz submitted! Check your answers.');
    };

    const handleNewQuiz = () => {
        resetQuiz();
        toast.info('Starting a new quiz. Fill in your settings!');
    };

    const updateSettings = (key, value) => {
        const newSettings = { ...quizSettings, [key]: value };
        setQuizSettings(newSettings);
    };



    const getAnswerClass = (question, selectedAnswer, option, selectedAnswerDisplayOption, isQuizCompleted) => {
        // If no answer is selected or highlight should not be applied based on the settings
        if (!selectedAnswer || (selectedAnswerDisplayOption === 'After Quiz' && !isQuizCompleted)) {
            return {}; // No styling applied if quiz is not completed or highlight is disabled for "After Quiz"
        }

        // Handle multiple_choice questions
        if (question.type === 'multiple_choice') {
            const selectedOptionLetter = selectedAnswer ? selectedAnswer.charAt(0) : ''; // Get the letter of the selected answer (A, B, C, D)
            const optionLetter = option.charAt(0); // Get the letter of the current option (A, B, C, D)

            const isCorrect = optionLetter === question.correctAnswer; // Check if this option is the correct answer
            const isSelected = selectedOptionLetter === optionLetter; // Check if this option is selected by the user

            // Handle "After Each Question" behavior
            if (selectedAnswerDisplayOption === 'After Each Question') {
                if (isSelected) {
                    // Green for correct, red for incorrect answer
                    return { backgroundColor: isCorrect ? 'green' : 'red', color: 'white' };
                }

                if (isCorrect) {
                    // Highlight correct answer even if not selected
                    return { backgroundColor: 'green', color: 'white' };
                }
            }

            // Handle "After Quiz" behavior (only when quiz is completed)
            if (selectedAnswerDisplayOption === 'After Quiz' && isQuizCompleted) {
                if (isSelected) {
                    // Green for correct selected answer, red for incorrect selected answer
                    return { backgroundColor: isCorrect ? 'green' : 'red', color: 'white' };
                }

                if (isCorrect) {
                    // Highlight correct answer in green
                    return { backgroundColor: 'green', color: 'white' };
                }
            }
        }

        // Handle true_false questions
        if (question.type === 'true_false') {
            const isCorrect = option === question.correctAnswer; // Check if the option matches the correct answer
            const isSelected = selectedAnswer === option; // Check if this option is selected by the user

            // Handle "After Each Question" behavior
            if (selectedAnswerDisplayOption === 'After Each Question') {
                if (isSelected) {
                    // Green for correct, red for incorrect answer
                    return { backgroundColor: isCorrect ? 'green' : 'red', color: 'white' };
                }

                if (isCorrect) {
                    // Highlight correct answer even if not selected
                    return { backgroundColor: 'green', color: 'white' };
                }
            }

            // Handle "After Quiz" behavior (only when quiz is completed)
            if (selectedAnswerDisplayOption === 'After Quiz' && isQuizCompleted) {
                if (isSelected) {
                    // Green for correct selected answer, red for incorrect selected answer
                    return { backgroundColor: isCorrect ? 'green' : 'red', color: 'white' };
                }

                if (isCorrect) {
                    // Highlight correct answer in green
                    return { backgroundColor: 'green', color: 'white' };
                }
            }
        }

        return {}; // No styling applied to unselected, incorrect options
    };



    return (
        <Box sx={{ padding: 2 }}>
            <Card sx={{ padding: 3 }}>
                <Typography
                    sx={{
                        position: 'absolute',
                        top: 30, // You can adjust the top value based on your needs
                        right: 30, // Places the button in the top-right corner
                    }}
                >
                    <IconButton
                        onClick={toggleColorMode}
                        sx={{
                            backgroundColor: 'transparent', // Optional: Make the background transparent
                            color: 'inherit', // Inherit color based on theme (light/dark)
                            '&:hover': {
                                backgroundColor: 'transparent', // Keep background transparent on hover
                            },
                        }}
                    >
                        {currentMode === 'light' ? (
                            <Brightness4 fontSize="large" /> // Dark mode icon
                        ) : (
                            <Brightness7 fontSize="large" /> // Light mode icon
                        )}
                    </IconButton>
                </Typography>
                <CardContent>
                    <h3>Quiz Settings</h3>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Autocomplete
                                options={subjects}
                                value={quizSettings?.subject || ''}
                                onChange={(event, newValue) => updateSettings('subject', newValue)}
                                disabled={isQuizStarted || isQuizCompleted}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Subject"
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Autocomplete
                                options={quizTypes}  // Pass the array directly
                                getOptionLabel={(option) => option.label}  // Extract label for display
                                value={quizTypes.find(type => type.value === quizSettings?.quizType) || null}
                                onChange={(event, newValue) => updateSettings('quizType', newValue?.value)}
                                disabled={isQuizStarted || isQuizCompleted}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Quiz Type"
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Autocomplete
                                options={numberOptions}
                                value={quizSettings?.questions || ''}
                                onChange={(event, newValue) => updateSettings('questions', newValue)}
                                disabled={isQuizStarted || isQuizCompleted}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Questions"
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Autocomplete
                                options={shuffleOptions}
                                value={quizSettings?.isShuffled || ''}
                                onChange={(event, newValue) => updateSettings('isShuffled', newValue)}
                                disabled={isQuizStarted || isQuizCompleted}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Shuffle Questions"
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2.4}>
                            <Autocomplete
                                options={answerDisplayOptions}
                                value={quizSettings?.showAnswers || ''}
                                onChange={(event, newValue) => updateSettings('showAnswers', newValue)}
                                disabled={isQuizStarted || isQuizCompleted}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Show Answers"
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' }, // Stack in column on mobile (xs) and row on larger screens
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '10px',
                            width: '100%', // Ensure the Box takes the full width
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleStartQuiz}
                            disabled={isQuizStarted || isQuizCompleted}
                            sx={{
                                marginTop: 2,
                                width: { xs: '100%', sm: '200px' }, // Make the button full width on mobile and fixed width on larger screens
                            }}
                        >
                            Start Quiz
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleNewQuiz}
                            sx={{
                                marginTop: 2,
                                marginLeft: { sm: 2 }, // Add margin on larger screens for spacing
                                width: { xs: '100%', sm: '200px' }, // Make the button full width on mobile and fixed width on larger screens
                            }}
                        >
                            Start New Quiz
                        </Button>
                        {isQuizStarted && !isQuizCompleted && (
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleSubmitQuiz}
                                sx={{
                                    marginTop: 2,
                                    marginLeft: { sm: 2 }, // Add margin on larger screens
                                    width: { xs: '100%', sm: '200px' }, // Make the button full width on mobile and fixed width on larger screens
                                }}
                            >
                                Submit Quiz
                            </Button>
                        )}
                    </Box>


                    {isQuizStarted && !isQuizCompleted && currentQuestions.map((question, index) => (
                        <div key={question.id}>
                            <h4>
                                {index + 1 + (currentPage - 1) * questionsPerPage}. {question.questionText}
                            </h4>
                            {Array.isArray(question.options) && question.options.map((option, optionIndex) => (
                                <div className="radio-container" key={optionIndex}>
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value={option}
                                        checked={answers[question.id] === option}
                                        onChange={() => handleAnswerChange(question.id, option)}
                                        disabled={isQuizCompleted}
                                        className="radio-input"
                                        id={`question-${question.id}-${option}`}
                                    />
                                    <span
                                        style={
                                            // Highlighting logic based on quizSettings.showAnswers
                                            (quizSettings?.showAnswers === 'After Quiz' && !isQuizCompleted)
                                                ? {} // No highlight if quiz is not completed and showAnswers is "After Quiz"
                                                : getAnswerClass(
                                                    question,
                                                    answers[question.id],  // The selected answer for this question
                                                    option,
                                                    quizSettings?.showAnswers, // Using quizSettings.showAnswers for display logic
                                                    isQuizCompleted
                                                )
                                        }
                                    >
                                        {option}
                                    </span>
                                </div>
                            ))}


                            {/* Explanation and Answer show only after each question if enabled */}
                            {quizSettings?.showAnswers === 'After Each Question' && answers[question.id] && (
                                <Collapse in={!!answers[question.id]} timeout="auto" unmountOnExit>
                                    <Box sx={{ marginTop: 1 }}>
                                        <p><strong>Answer:</strong> {question.correctAnswer}</p>
                                        <p><strong>Explanation:</strong> {question.explanation}</p>
                                    </Box>
                                </Collapse>
                            )}
                        </div>
                    ))}

                    {isQuizStarted && totalQuestions > questionsPerPage && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
                        </Box>
                    )}


                    {isQuizCompleted && (
                        <Box sx={{ marginTop: 3 }}>
                            <h3>Quiz Completed! Here's your result:</h3>
                            <h4>
                                Score: {Object.entries(answers).reduce((score, [questionId, selectedAnswer]) => {
                                    const question = questions.find(q => q.id === Number(questionId));
                                    return score + (question && selectedAnswer.charAt(0) === question.correctAnswer ? 1 : 0);
                                }, 0)} / {totalQuestions}
                            </h4>

                            {/* Display questions with answers */}
                            {currentQuestions.map((question, index) => {
                                const selectedAnswer = answers[question.id];
                                const isCorrect = question.correctAnswer === selectedAnswer?.charAt(0);

                                return (
                                    <Card key={question.id} sx={{ marginBottom: 2, padding: 2 }}>
                                        <h4>
                                            {index + 1 + (currentPage - 1) * questionsPerPage}. {question.questionText}
                                        </h4>
                                        {Array.isArray(question.options) && question.options.map((option, optionIndex) => {
                                            const isSelected = selectedAnswer === option;
                                            const isOptionCorrect = question.correctAnswer === option.charAt(0);

                                            return (
                                                <Box
                                                    key={optionIndex}
                                                    sx={{
                                                        marginLeft: 2,
                                                        padding: 1,
                                                        backgroundColor: isSelected
                                                            ? (isOptionCorrect ? 'green' : 'red')
                                                            : (isOptionCorrect ? 'lightgreen' : 'transparent'),
                                                        color: isSelected || isOptionCorrect ? 'white' : theme.palette.text.primary, // Use theme text color
                                                        borderRadius: 1,
                                                        marginBottom: 1,
                                                        // Adjust text color based on the theme mode (dark/light)
                                                        ...(theme.palette.mode === 'dark' && {
                                                            color: isSelected || isOptionCorrect ? 'white' : 'lightgray', // Adjust text color for dark mode
                                                        }),
                                                    }}
                                                >
                                                    {option}
                                                    {isOptionCorrect && !isSelected && ' (Correct)'}
                                                    {isSelected && !isOptionCorrect && ' (Your Answer)'}
                                                </Box>
                                            );
                                        })}

                                        {/* Always show Answer and Explanation */}
                                        <Collapse in={true} timeout="auto" unmountOnExit>
                                            <Box sx={{ marginTop: 1 }}>
                                                <p><strong>Answer:</strong> {question.correctAnswer}</p>
                                                <p><strong>Explanation:</strong> {question.explanation}</p>
                                            </Box>
                                        </Collapse>
                                    </Card>
                                );
                            })}

                            {/* Pagination */}
                            {isQuizCompleted && totalQuestions > questionsPerPage && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                                    <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
                                </Box>
                            )}


                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box >
    );
};

export default QuizPanel;

import { useEffect, useState } from 'react';
import { Button, Form, FormLabel } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as client from './client';

export default function QuizPreview() {

    // TODO: CHANGE TO quiz data
    
    const { cid, qid } = useParams();
    const courseId = cid!;
    const quizId = qid!; // Use passed quizId
    const { quizzes } = useSelector((state: any) => state.quizReducer);
    const filteredQuiz = quizzes.find((quiz: any) => quiz._id === qid);
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const showCorrectAnswers = filteredQuiz.showCorrectAnswers;
    const multipleAttempts = filteredQuiz.allowMultipleAttempts;
    const maxAttempts = filteredQuiz.attemptsAllowed;

    // Define question type
    type Question = {
        _id: string;
        title: string;
        type: string;
        options?: string[];
        answer: string;
        userAnswer: string;
        editing: string;
        quizId: string;
        points: number;
    };

    // Define attempt type to store previous attempts
    type Attempt = {
        attemptNumber: number;
        answers: string[];
        score: number;
        totalPoints: number;
        date: Date;
    };

    const [canTake, setCanTake] = useState<boolean>(true);
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [showAttempts, setShowAttempts] = useState<boolean>(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    // Initialize questions with the existing data
    const getQuestions = async (quizId: string) => {
        try {
            const initialQuestions = await client.getQuestions(quizId);

            // Ensure each question has a unique ID and initialize userAnswer
            const qs = initialQuestions.map((q: any) => ({
                ...q,
                userAnswer: '',
            }));

            try {
                // Try to get previous answers
                const result = await client.getMaxAttempts(quizId, currentUser._id);

                // Check if result exists before destructuring
                if (result) {
                    const { answers } = result;

                    // Update each question's userAnswer with previous answers
                    if (answers && Array.isArray(answers)) {
                        answers.forEach((answer: string, index: number) => {
                            if (index < qs.length) {
                                qs[index].userAnswer = answer;
                            }
                        });
                    }
                }
            } catch (error: any) {
                // Only check for 404 error
                if (error.status === 404) {
                    console.log('No previous attempts found');
                    // Do nothing, questions already have empty userAnswers
                } else {
                    // For any other error, re-throw it
                    throw error;
                }
            }

            setQuestions(qs);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    // Handle form input changes - fixed to ensure only the right question updates
    const handleInputChange = (questionId: string, value: string) => {
        setQuestions((prevQuestions) => {
            return prevQuestions.map((q) => {
                // Only update the specific question
                if (q._id === questionId) {
                    return { ...q, userAnswer: value };
                }
                // Return other questions unchanged
                return q;
            });
        });
    };

    // Submit quiz and calculate score
    const handleSubmit = async () => {
        let currentScore = 0;
        let answers: string[] = [];
        questions.forEach((q) => {
            answers.push(q.userAnswer);
            if (q.userAnswer.toLowerCase() === q.answer.toLowerCase()) {
                currentScore += q.points;
            }
        });

        // Store current attempt
        const newAttempt: Attempt = {
            score: currentScore,
            answers: answers,
            attemptNumber: attempts.length + 1,
            totalPoints: questions.reduce((acc, q) => acc + q.points, 0),
            date: new Date(),
        };
        if (!isFaculty()) {
            await client.putAttempt(currentUser._id, quizId, newAttempt);
        }
        setAttempts((prev) => [...prev, newAttempt]);

        checkAttempts();
        setScore(currentScore);
        setSubmitted(true);
    };

    // Reset the quiz
    const handleReset = () => {
        // Check if we've reached the maximum number of attempts
        if (attempts.length > maxAttempts - 1 && !isFaculty()) {
            return; // Don't allow any more attempts
        }

        // // Store current attempt
        // if (submitted) {
        //     const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);
        //     const newAttempt: Attempt = {
        //         score: score,
        //         totalPoints: totalPoints,
        //         date: new Date(),
        //     };

        //     setAttempts((prev) => [...prev, newAttempt]);
        // }

        // Reset all questions' userAnswers to empty strings

        setQuestions((prevQuestions) =>
            prevQuestions.map((q) => ({
                ...q,
                userAnswer: '',
            }))
        );

        setSubmitted(false);
        setScore(0);
    };

    // Format date for display
    const formatDate = (date: Date) => {
        return date.toLocaleString();
    };

    // Toggle showing previous attempts
    const toggleAttempts = () => {
        setShowAttempts((prev) => !prev);
    };

    // Render different input types based on question type
    const renderQuestionInput = (question: Question) => {
        const handleChange = (questionId: string, value: string) => {
            handleInputChange(questionId, value);
        };
        switch (question.type) {
            case 'fb':
                return (
                    <Form.Control
                        type="text"
                        value={question.userAnswer}
                        onChange={(e) => handleChange(question._id, e.target.value)}
                        disabled={submitted || !canTake}
                        className="mb-3"
                    />
                );
            case 'tf':
            case 'multiple-choice':
                return (
                    <div className="mb-3">
                        {question.options?.map((option, index) => (
                            <Form.Check
                                key={`q${question._id}-option${index}`}
                                type="radio"
                                id={`q${question._id}-option${index}`}
                                label={option}
                                name={`question-${question._id}`}
                                value={option}
                                checked={question.userAnswer === option}
                                onChange={(e) => handleChange(question._id, e.target.value)}
                                disabled={submitted || !canTake}
                                className="mb-1"
                            />
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    // Display feedback after submission
    const renderFeedback = (question: Question) => {
        if (!submitted) return null;

        const isCorrect = question.userAnswer.toLowerCase() === question.answer.toLowerCase();

        return (
            <div className={`mt-2 ${isCorrect ? 'text-success' : 'text-danger'}`}>
                {isCorrect ? '✓ Correct' : `✗ Incorrect.`}
                {showCorrectAnswers && `The correct answer is: ${question.answer}`}
            </div>
        );
    };

    const totalPoints = questions.reduce((acc, q) => acc + q.points, 0);

    // Get the highest score from all attempts including current
    const getHighestScore = () => {
        if (attempts.length === 0 && !submitted) {
            return null;
        }

        const allScores = [...attempts.map((a) => a.score), ...(submitted ? [score] : [])];
        return Math.max(...allScores);
    };

    // Get the best percentage score
    const getBestPercentage = () => {
        const highest = getHighestScore();
        return highest !== null ? Math.round((highest / totalPoints) * 100) : null;
    };
    const getAttempts = async (quizId: any, userId: any) => {
        const oldAttempts = await client.getAttempts(quizId, userId);
        setAttempts(oldAttempts);
        checkAttempts();
    };
    const checkAttempts = () => {
        if (isFaculty()) return;
        if (attempts.length >= maxAttempts) {
            setCanTake(false);
        }
    };
    const isFaculty = () => {
        return currentUser.role === 'FACULTY';
    };
    const navigate = useNavigate();

    useEffect(() => {
        getQuestions(quizId);
        getAttempts(quizId, currentUser._id);
    }, [quizId]);

    useEffect(() => {
        checkAttempts();
    }, [attempts]);

    return (
        <div className="container py-4">
            <div className="d-flex align-items-center">
                <h2 className="mb-4 me-auto">{isFaculty()? 'Quiz Preview': 'Quiz'}</h2>
                {/* Edit button next to the title */}
                {isFaculty() && (
                    <button
                        className="btn btn-outline-danger"
                        //TODO:Update the naviagation
                        onClick={() => navigate(`/Kambaz/Courses/${courseId}/Quizzes/${quizId}`)}
                    >
                        Edit
                    </button>
                )}
            </div>

            {/* Attempts information */}
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <div>
                    <span className="badge bg-danger">
                        {!isFaculty()
                            ? `Attempt ${attempts.length} of ${maxAttempts}`
                            : `Attempt ${attempts.length}`}
                    </span>
                </div>
                {score > 0 && submitted && (
                    <div>
                        <span
                            className={`badge ${
                                score / totalPoints >= 0.7 ? 'bg-success' : 'bg-danger'
                            }`}
                        >
                            {Math.round((score / totalPoints) * 100)}% Score
                        </span>
                    </div>
                )}
            </div>

            {/* Display previous attempts if there are any */}
            {multipleAttempts && attempts.length > 0 && (
                <div className="mb-4">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={toggleAttempts}
                        className="mb-2"
                    >
                        {showAttempts
                            ? 'Hide Previous Attempts'
                            : `Show Previous Attempts (${attempts.length})`}
                    </Button>

                    {showAttempts && (
                        <div className="border p-3 rounded bg-light">
                            <h5>Previous Attempts</h5>
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attempts.map((attempt, idx) => (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>{formatDate(attempt.date)}</td>
                                            <td>
                                                {attempt.score}/{attempt.totalPoints} (
                                                {Math.round(
                                                    (attempt.score / attempt.totalPoints) * 100
                                                )}
                                                %)
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="table-info">
                                        <td colSpan={2}>
                                            <strong>Best Score:</strong>
                                        </td>
                                        <td>
                                            {getHighestScore() !== null ? (
                                                <strong>
                                                    {getHighestScore()}/{totalPoints} (
                                                    {getBestPercentage()}%)
                                                </strong>
                                            ) : (
                                                'No attempts yet'
                                            )}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Quiz form */}
            <Form>
                {questions.map((q, index) => (
                    <div key={`question-${q._id}-${index}`} className="mb-4 p-3 border rounded">
                        <h5>Question {index + 1}</h5>
                        <FormLabel>
                            {q.title}
                            <small className="ms-2">
                                ({q.points} {q.points === 1 ? 'point' : 'points'})
                            </small>
                        </FormLabel>
                        {renderQuestionInput(q)}
                        {renderFeedback(q)}
                    </div>
                ))}

                <div className="d-flex gap-2 mt-4">
                    {!submitted && canTake ? (
                        <Button type="button" variant="primary" onClick={handleSubmit}>
                            Submit Quiz
                        </Button>
                    ) : (
                        <>
                            {canTake ? (
                                <Button variant="primary" onClick={handleReset}>
                                    {isFaculty()
                                        ? 'Retake Quiz'
                                        : `Retake Quiz (${
                                              maxAttempts - attempts.length
                                          } attempts remaining)`}
                                </Button>
                            ) : (
                                <Button variant="secondary" disabled>
                                    No Attempts Remaining
                                </Button>
                            )}
                            <div className="ms-3 d-flex align-items-center">
                                <strong>
                                    Your Score: {score}/{totalPoints} points (
                                    {Math.round((score / totalPoints) * 100)}%)
                                </strong>
                            </div>
                        </>
                    )}
                </div>
            </Form>
        </div>
    );
}

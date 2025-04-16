import { useState } from 'react';
import { Button, Form, FormLabel } from 'react-bootstrap';

export default function QuizzPreview({
    qid,
    maxAttempts = 2,
}: {
    qid: string;
    maxAttempts?: number;
}) {
    // TODO: update to fetch attempts
    // const maxAttempts = 3;

    // Define question type
    type Question = {
        id: number;
        name: string;
        type: string; // Changed from strict union type to allow any string
        options?: string[];
        actualAnswer: string;
        userAnswer: string;
        editing: string;
        points: number;
    };

    // Define attempt type to store previous attempts
    type Attempt = {
        score: number;
        totalPoints: number;
        date: Date;
    };

    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [showAttempts, setShowAttempts] = useState<boolean>(false);

    // Initialize questions with the existing data
    const initialQuestions: Question[] = [
        {
            id: 1,
            name: 'What is your name?',
            type: 'fb',
            actualAnswer: 'vinay',
            userAnswer: '',
            editing: 'false',
            points: 1,
        },
        {
            id: 2,
            name: 'Is your age 100?',
            type: 'tf',
            options: ['true', 'false'],
            actualAnswer: 'false',
            userAnswer: '',
            editing: 'false',
            points: 1,
        },
        {
            id: 3,
            name: 'What is your favorite color?',
            type: 'multiple-choice',
            options: ['Red', 'Blue', 'Green'],
            actualAnswer: 'red',
            userAnswer: '',
            editing: 'false',
            points: 1,
        },
    ];

    // State to track the questions and user answers
    const [questions, setQuestions] = useState<Question[]>(initialQuestions);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    // Handle form input changes
    const handleInputChange = (questionId: number, value: string) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) => (q.id === questionId ? { ...q, userAnswer: value } : q))
        );
    };

    // Submit quiz and calculate score
    const handleSubmit = () => {
        let currentScore = 0;

        questions.forEach((q) => {
            if (q.userAnswer.toLowerCase() === q.actualAnswer.toLowerCase()) {
                currentScore += q.points;
            }
        });

        setScore(currentScore);
        setSubmitted(true);
    };

    // Reset the quiz
    const handleReset = () => {
        // Check if we've reached the maximum number of attempts
        if (attempts.length >= maxAttempts - 1) {
            return; // Don't allow any more attempts
        }
        // Store current attempt
        if (submitted) {
            const newAttempt: Attempt = {
                score: score,
                totalPoints: totalPoints,
                date: new Date(),
            };

            setAttempts((prev) => [...prev, newAttempt]);
        }

        setQuestions(() =>
            initialQuestions.map((q) => ({
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
        switch (question.type) {
            case 'fb':
                return (
                    <Form.Control
                        type="text"
                        value={question.userAnswer}
                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                        disabled={submitted}
                        className="mb-3"
                    />
                );
            case 'tf':
                return (
                    <div className="mb-3">
                        {question.options?.map((option, index) => (
                            <Form.Check
                                key={index}
                                type="radio"
                                id={`q${question.id}-option${index}`}
                                label={option}
                                name={`question-${question.id}`}
                                value={option}
                                checked={question.userAnswer === option}
                                onChange={(e) => handleInputChange(question.id, e.target.value)}
                                disabled={submitted}
                                className="mb-1"
                            />
                        ))}
                    </div>
                );
            case 'multiple-choice':
                return (
                    <div className="mb-3">
                        {question.options?.map((option, index) => (
                            <Form.Check
                                key={index}
                                type="radio"
                                id={`q${question.id}-option${index}`}
                                label={option}
                                name={`question-${question.id}`}
                                value={option}
                                checked={question.userAnswer === option}
                                onChange={(e) => handleInputChange(question.id, e.target.value)}
                                disabled={submitted}
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
        // if question instant display setting is on then display else dont
        if (!submitted) return null;

        const isCorrect = question.userAnswer.toLowerCase() === question.actualAnswer.toLowerCase();

        return (
            <div className={`mt-2 ${isCorrect ? 'text-success' : 'text-danger'}`}>
                {isCorrect
                    ? '✓ Correct'
                    : `✗ Incorrect. The correct answer is: ${question.actualAnswer}`}
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

    return (
        <div className="container py-4">
            {/* TODO: if user is faculty show prevoew else show Quizz 'ta/e' */}
            <h2 className="mb-4">Quiz Preview</h2>

            {/* Attempts information */}
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <div>
                    <span className="badge bg-info">
                        Attempt {attempts.length + (submitted ? 1 : 0)} of {maxAttempts}
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
            {attempts.length > 0 && (
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
                                    {submitted && (
                                        <tr className="table-active">
                                            <td>{attempts.length + 1} (Current)</td>
                                            <td>{formatDate(new Date())}</td>
                                            <td>
                                                {score}/{totalPoints} (
                                                {Math.round((score / totalPoints) * 100)}%)
                                            </td>
                                        </tr>
                                    )}
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
                    <div key={q.id} className="mb-4 p-3 border rounded">
                        <h5>Question {index + 1}</h5>
                        <FormLabel>
                            {q.name}
                            <small>
                                ({q.points} {q.points === 1 ? 'point' : 'points'})
                            </small>
                        </FormLabel>
                        {renderQuestionInput(q)}
                        {renderFeedback(q)}
                    </div>
                ))}

                <div className="d-flex gap-2 mt-4">
                    {!submitted ? (
                        <Button type="submit" variant="primary" onClick={handleSubmit}>
                            Submit Quiz
                        </Button>
                    ) : (
                        <>
                            {attempts.length < maxAttempts - 1 ? (
                                <Button variant="primary" onClick={handleReset}>
                                    Retake Quiz ({maxAttempts - attempts.length - 1} attempts
                                    remaining)
                                </Button>
                            ) : attempts.length === maxAttempts - 1 ? (
                                <Button variant="secondary" onClick={handleReset}>
                                    No Attempts Remaining
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

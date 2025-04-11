import { useState } from 'react';
import { Button, Form, FormLabel } from 'react-bootstrap';

export default function QuizzPreview({ qid }: { qid: string }) {
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
        setQuestions((prev: any) =>
            initialQuestions.map((q) => ({
                ...q,
                userAnswer: '',
            }))
        );
        setSubmitted(false);
        setScore(0);

    };
    console.log(submitted);

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

    return (
        <div className="container py-4">
            <h2 className="mb-4">Quiz Preview</h2>
            <Form
                onSubmit={() => {
                    // submit function not needed here for now
                }}
            >
                {questions.map((q, index) => (
                    <div key={q.id} className="mb-4 p-3 border rounded">
                        <h5>Question {index + 1}</h5>
                        <FormLabel>
                            {q.name}{' '}
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
                            <Button variant="primary" onClick={handleReset}>
                                Retake Quiz
                            </Button>
                            <div className="ms-3 d-flex align-items-center">
                                <strong>
                                    Your Score: {score}/
                                    {questions.reduce((acc, q) => acc + q.points, 0)} points
                                </strong>
                            </div>
                        </>
                    )}
                </div>
            </Form>
        </div>
    );
}

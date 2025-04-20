import { useEffect, useState } from 'react';
import * as client from './client';
import { useParams } from 'react-router';
export default function QuestionsEditor() {
    const { qid } = useParams();
    const quizId = qid!;
    // Define question type
    type Question = {
        _id: string;
        title: string;
        type: string;
        options?: string[];
        answer: string;
        editing: string;
        quizId: string;
        points: number;
    };
    
    const [questions, setQuestions] = useState<Question[]>([]);

    // Initialize questions with the existing data
    const getQuestions = async (quizId: string) => {
        const initialQuestions = await client.getQuestions(quizId);
        setQuestions(initialQuestions);
    };

    const [showModal, setShowModal] = useState(false);

    // Initial state for new question
    const [newQuestion, setNewQuestion] = useState({
        _id: '',
        title: '',
        type: 'fb',
        description: '',
        options: [''],
        answer: '',
        quizId: quizId,
        points: 0,
        editing: 'false',
    });

    // Function to add a new question
    const handleAddQuestion = async () => {

        // Create the question object based on type
        let questionToAdd = {
            ...newQuestion,
            _id: new Date().getTime().toString(),
        };

        // Ensure proper options format based on question type
        if (questionToAdd.type === 'tf') {
            questionToAdd.options = ['true', 'false'];
        } else if (questionToAdd.type === 'multiple-choice') {
            // Initialize options array if undefined
            if (!questionToAdd.options) {
                questionToAdd.options = [];
            } else {
                // Filter out any empty options
                questionToAdd.options = questionToAdd.options.filter((opt) => opt.trim() !== '');
            }
        }

        await client.addQuestion(questionToAdd);

        // Add the new question to the questions array
        setQuestions([...questions, questionToAdd]);

        // Reset form for next question
        setNewQuestion({
            _id: '',
            title: '',
            type: 'fb',
            description: '',
            options: [''],
            answer: '',
            quizId: quizId,
            points: 0,
            editing: 'false',
        });

        // Close the modal
        setShowModal(false);
    };

    // Toggle edit mode for a question
    const toggleEditMode = (questionId: string) => {
        setQuestions(
            questions.map((q) => {
                if (q._id === questionId) {
                    // Convert editing to a string if needed
                    const currentEditing = q.editing === 'true' ? 'true' : 'false';
                    const newEditing = currentEditing === 'true' ? 'false' : 'true';
                    return { ...q, editing: newEditing };
                }
                return q;
            })
        );
    };

    // Handle changes to question fields
    const handleQuestionChange = async (questionId: string, field: any, value: any) => {
        setQuestions(
            questions.map((q) => {
                if (q._id === questionId) {
                    return { ...q, [field]: value };
                }
                return q;
            })
        );
    };

    // Save question (just turns off edit mode)
    const saveQuestion = async (questionId: string) => {
        // Get the question to validate
        const questionToSave = questions.find((q) => q._id === questionId);

        // Validate based on type
        if (questionToSave?.type === 'multiple-choice') {
            // Filter out any empty options
            if (questionToSave.options) {
                const filteredOptions = questionToSave.options.filter((opt) => opt.trim() !== '');

                // Update filtered options before saving
                await setQuestions(
                    questions.map((q) => {
                        if (q._id === questionId) {
                            return {
                                ...q,
                                options: filteredOptions,
                                editing: 'false',
                            };
                        }
                        return q;
                    })
                );
            }
        }
        else {// For other types, just turn off editing
            await setQuestions(
                questions.map((q) => {
                    if (q._id === questionId) {
                        return { ...q, editing: 'false' };
                    }
                    return q;
                })
            );
        }
        let questionToUpdate = questions.find((q) => q._id === questionId)!;
        questionToUpdate = { ...questionToUpdate, editing: 'false' };
        await client.updateQuestion(questionToUpdate._id, questionToUpdate);
    };

    const deleteQuestion = async (qid:any) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            setQuestions(questions.filter((q) => q._id !== qid));
            await client.deleteQuestion(qid);
        }
    }

    useEffect(() => {
        getQuestions(quizId);
    }, []);
    
    return (
        <div id="quiz-questions-editor" className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h4 fw-bold">Questions Editor</h1>
                <button className="btn btn-outline-danger" onClick={() => setShowModal(true)}>
                    + Add Question
                </button>
            </div>
            <div className="container">
                <div className="row">
                    {questions.map((q) => (
                        <div key={q._id} className="col-12 mb-3">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">
                                        {q.title} ({q.points} points)
                                    </h5>
                                    <div>
                                        {/* <span className="badge bg-primary me-2">{q.type}</span> */}
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => toggleEditMode(q._id)}
                                        >
                                            {q.editing === 'true' ? 'Cancel' : 'Edit'}
                                        </button>
                                    </div>
                                </div>

                                {q.editing !== 'true' ? (
                                    // View mode
                                    <div className="card-body">
                                        {/* Display options for multiple-choice or tf questions */}
                                        {(q.type === 'multiple-choice' || q.type === 'tf') &&
                                            q.options && (
                                                <div className="mt-3">
                                                    <p className="fw-bold mb-2">Options:</p>
                                                    <ul className="list-group">
                                                        {q.options.map((opt, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="list-group-item"
                                                            >
                                                                {opt}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                        {/* Display user and actual answers */}
                                        <div className="mt-3">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="alert alert-info mb-0">
                                                        <strong>Answer:</strong> {q.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Edit mode
                                    <div className="card-body">
                                        <form>
                                            {/* Question text */}
                                            <div className="mb-3">
                                                <label
                                                    htmlFor={`question-${q._id}`}
                                                    className="form-label"
                                                >
                                                    Question Text
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id={`question-${q._id}`}
                                                    value={q.title}
                                                    onChange={(e) =>
                                                        handleQuestionChange(
                                                            q._id,
                                                            'title',
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            {/* Points */}
                                            <div className="mb-3">
                                                <label
                                                    htmlFor={`question-${q._id}`}
                                                    className="form-label"
                                                >
                                                    Points
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id={`question-${q._id}`}
                                                    value={q.points}
                                                    onChange={(e) =>
                                                        handleQuestionChange(
                                                            q._id,
                                                            'points',
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>

                                            {/* Options for multiple-choice or tf questions */}
                                            {(q.type === 'multiple-choice' || q.type === 'tf') && (
                                                <div className="mb-3">
                                                    <label className="form-label">Options</label>
                                                    {q.type === 'tf' ? (
                                                        <p className="text-muted">
                                                            True/False options are fixed
                                                        </p>
                                                    ) : (
                                                        <>
                                                            {q.options?.map((opt, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="input-group mb-2"
                                                                >
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={opt}
                                                                        onChange={(e) => {
                                                                            const newOptions = [
                                                                                ...(q.options as string[]),
                                                                            ];
                                                                            newOptions[idx] =
                                                                                e.target.value;
                                                                            handleQuestionChange(
                                                                                q._id,
                                                                                'options',
                                                                                newOptions
                                                                            );
                                                                        }}
                                                                    />
                                                                    {(q.options as string[])
                                                                        .length > 2 && (
                                                                        <button
                                                                            className="btn btn-outline-danger"
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const newOptions = (
                                                                                    q.options as string[]
                                                                                ).filter(
                                                                                    (_, i) =>
                                                                                        i !== idx
                                                                                );
                                                                                handleQuestionChange(
                                                                                    q._id,
                                                                                    'options',
                                                                                    newOptions
                                                                                );
                                                                            }}
                                                                        >
                                                                            <i className="bi bi-trash"></i>
                                                                            Remove
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-primary btn-sm"
                                                                onClick={() => {
                                                                    const newOptions = [
                                                                        ...(q.options || []),
                                                                        '',
                                                                    ];
                                                                    handleQuestionChange(
                                                                        q._id,
                                                                        'options',
                                                                        newOptions
                                                                    );
                                                                }}
                                                            >
                                                                Add Option
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            {/* Answer */}
                                            <div className="mb-3">
                                                <label
                                                    htmlFor={`answer-${q._id}`}
                                                    className="form-label"
                                                >
                                                    Correct Answer
                                                </label>
                                                {q.type === 'multiple-choice' ? (
                                                    <select
                                                        className="form-select"
                                                        id={`answer-${q._id}`}
                                                        value={q.answer}
                                                        onChange={(e) =>
                                                            handleQuestionChange(
                                                                q._id,
                                                                'answer',
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="">
                                                            Select correct answer
                                                        </option>
                                                        {q.options?.map((opt, idx) => (
                                                            <option
                                                                key={idx}
                                                                value={opt.toLowerCase()}
                                                            >
                                                                {opt}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : q.type === 'tf' ? (
                                                    <select
                                                        className="form-select"
                                                        id={`answer-${q._id}`}
                                                        value={q.answer}
                                                        onChange={(e) =>
                                                            handleQuestionChange(
                                                                q._id,
                                                                'answer',
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value="true">True</option>
                                                        <option value="false">False</option>
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id={`answer-${q._id}`}
                                                        value={q.answer}
                                                        onChange={(e) =>
                                                            handleQuestionChange(
                                                                q._id,
                                                                'answer',
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>

                                            <div className="d-flex justify-content-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-danger me-2"
                                                    onClick={() => deleteQuestion(q._id)}
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => saveQuestion(q._id)}
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Add Question Modal */}
            {showModal && (
                <div
                    className="modal d-block"
                    tabIndex={-1}
                    style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add a New Question</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Question Text</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter question"
                                        value={newQuestion.title}
                                        onChange={(e) =>
                                            setNewQuestion({
                                                ...newQuestion,
                                                title: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Points</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="1"
                                        value={newQuestion.points}
                                        onChange={(e) =>
                                            setNewQuestion({
                                                ...newQuestion,
                                                points: parseInt(e.target.value) || 1,
                                            })
                                        }
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Question Type</label>
                                    <select
                                        className="form-select"
                                        value={newQuestion.type}
                                        onChange={(e) => {
                                            const type = e.target.value;
                                            const updatedQuestion = {
                                                ...newQuestion,
                                                type,
                                                options: type === 'tf' ? ['true', 'false'] : [],
                                            };
                                            setNewQuestion(updatedQuestion);
                                        }}
                                    >
                                        <option value="fb">Fill in the Blank</option>
                                        <option value="tf">True/False</option>
                                        <option value="multiple-choice">Multiple Choice</option>
                                    </select>
                                </div>

                                {/* Options for multiple-choice questions */}
                                {newQuestion.type === 'multiple-choice' && (
                                    <div className="mb-3">
                                        <label className="form-label">Options</label>
                                        {newQuestion.options?.map((option, idx) => (
                                            <div key={idx} className="input-group mb-2">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={option}
                                                    onChange={(e) => {
                                                        const updatedOptions = [
                                                            ...newQuestion.options,
                                                        ];
                                                        updatedOptions[idx] = e.target.value;
                                                        setNewQuestion({
                                                            ...newQuestion,
                                                            options: updatedOptions,
                                                        });
                                                    }}
                                                />
                                                <button
                                                    className="btn btn-outline-danger"
                                                    type="button"
                                                    onClick={() => {
                                                        const updatedOptions =
                                                            newQuestion.options.filter(
                                                                (_, i) => i !== idx
                                                            );
                                                        setNewQuestion({
                                                            ...newQuestion,
                                                            options: updatedOptions,
                                                        });
                                                    }}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-sm mt-2"
                                            onClick={() => {
                                                setNewQuestion({
                                                    ...newQuestion,
                                                    options: [...(newQuestion.options || []), ''],
                                                });
                                            }}
                                        >
                                            Add Option
                                        </button>
                                    </div>
                                )}

                                {/* Actual answer field */}
                                <div className="mb-3">
                                    <label className="form-label">Correct Answer</label>
                                    {newQuestion.type === 'multiple-choice' ? (
                                        <select
                                            className="form-select"
                                            value={newQuestion.answer || ''}
                                            onChange={(e) =>
                                                setNewQuestion({
                                                    ...newQuestion,
                                                    answer: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">Select correct answer</option>
                                            {newQuestion.options?.map((option, idx) => (
                                                <option key={idx} value={option.toLowerCase()}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : newQuestion.type === 'tf' ? (
                                        <select
                                            className="form-select"
                                            value={newQuestion.answer || ''}
                                            onChange={(e) =>
                                                setNewQuestion({
                                                    ...newQuestion,
                                                    answer: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">Select correct answer</option>
                                            <option value="true">True</option>
                                            <option value="false">False</option>
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter correct answer"
                                            value={newQuestion.answer || ''}
                                            onChange={(e) =>
                                                setNewQuestion({
                                                    ...newQuestion,
                                                    answer: e.target.value,
                                                })
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                            {/* Modal footer */}
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={handleAddQuestion}
                                    disabled={
                                        !newQuestion.title ||
                                        !newQuestion.answer ||
                                        (newQuestion.type === 'multiple-choice' &&
                                            (!newQuestion.options ||
                                                newQuestion.options.length < 2))
                                    }
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

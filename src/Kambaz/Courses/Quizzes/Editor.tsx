import { Col, Form, FormControl, Row } from "react-bootstrap";
import QuizEditorButtons from "./QuizEditorButtons";
import { useParams } from "react-router";
import { updateQuiz, addQuiz } from "./reducer";
import "./editor.css";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import * as coursesClient from "../client";
import * as quizzesClient from "./client";
import Pills from "./Pills";

export default function QuizEditor({ cid }:
    {cid: string}
) {
    const { qid } = useParams();
    const { quizzes } = useSelector((state: any) => state.quizReducer);
    let filteredQuizzes = quizzes.filter((quiz: any) => quiz._id === qid);
    const dispatch = useDispatch();

    function updateOrAdd(
        {
            qid, 
            title,
            quizInstruct, 
            course, 
            points, 
            quizType, 
            quizGroup, 
            shuffleAnswers, 
            timeLimitBool, 
            timeLimit, 
            multipleAttempts,
            multipleAttemptLimit,
            showCorrectAnswers,
            accessCodeBool,
            accessCode,
            singleQuestion,
            webcamRequired,
            lockQuestions, 
            release_date, 
            due_date,
            until_date
        } : { 
            qid: string; 
            title: string; 
            quizInstruct: string;
            points: string;
            quizType: string;
            quizGroup: string;
            shuffleAnswers: boolean;
            timeLimitBool: boolean;
            timeLimit: string;
            multipleAttempts: boolean;
            multipleAttemptLimit: string;
            showCorrectAnswers: boolean;
            accessCodeBool: boolean;
            accessCode: string;
            singleQuestion: boolean;
            webcamRequired: boolean;
            lockQuestions: boolean;
            course: string; 
            release_date: string; 
            due_date: string; 
            until_date: string;
            
        }
    ) {
        if (qid === "createNew") {
            createQuizForCourse(title, quizInstruct, course, points, quizType, quizGroup, shuffleAnswers, timeLimitBool, timeLimit, multipleAttempts, multipleAttemptLimit, showCorrectAnswers, accessCodeBool, accessCode, singleQuestion, webcamRequired, lockQuestions, release_date, due_date, until_date);
        } else {
            saveQuiz({
                _id: qid, 
                title: title, 
                instructions: quizInstruct,
                course: course,  
                quiz_type: quizType, 
                points: points,
                assignment_group: quizGroup, 
                shuffle_answers: shuffleAnswers, 
                time_limit_bool: timeLimitBool, 
                time_limit: timeLimit, 
                multiple_attempts: multipleAttempts, 
                attempts: multipleAttemptLimit,
                show_correct_answers: showCorrectAnswers, 
                uses_access_code: accessCodeBool, 
                access_code: accessCode, 
                single_question: singleQuestion,
                webcam_required: webcamRequired, 
                lock_questions: lockQuestions, 
                available_date: release_date, 
                due_date: due_date,
                until_date: until_date,
            })
        }
    }

    if (filteredQuizzes.length === 0) {
        filteredQuizzes = [{ 
            _id: "createNew", 
            title: null, 
            instructions: null,
            course: cid,  
            quiz_type: "GRADED QUIZ", 
            points: null,
            assignment_group: "QUIZZES", 
            shuffle_answers: "true", 
            time_limit_bool: "true", 
            time_limit: "20", 
            multiple_attempts: "false", 
            attempts: "1",
            show_correct_answers: "true", //AND WHEN?
            uses_access_code: "false", 
            access_code: "", 
            single_question: "true",
            webcam_required: "false", 
            lock_questions: "false", 
            available_date: null, 
            due_date: null,
            until_date: null
        }]
    } 

    const [quizTitle, setQuizTitle] = useState(filteredQuizzes[0].title);
    const [quizInstructions, setQuizInstructions] = useState(filteredQuizzes[0].instructions);
    const [quizPoints, setQuizPoints] = useState(filteredQuizzes[0].points);
    const [quizType, setQuizType] = useState(filteredQuizzes[0].quiz_type);
    const [quizGroup, setQuizGroup] = useState(filteredQuizzes[0].assignment_group);
    const [shuffleAnswers, setShuffleAnswers] = useState(filteredQuizzes[0].shuffle_answers);
    const [timeLimitBool, setTimeLimitBool] = useState(filteredQuizzes[0].time_limit_bool);
    const [timeLimit, setTimeLimit] = useState(filteredQuizzes[0].time_limit);
    const [multipleAttempts, setMultipleAttempts] = useState(filteredQuizzes[0].multiple_attempts);
    const [multipleAttemptLimit, setMultipleAttemptLimit] = useState(filteredQuizzes[0].attempts);
    const [showCorrectAnswers, setShowCorrectAnswers] = useState(filteredQuizzes[0].show_correct_answers);
    const [accessCodeBool, setAccessCodeBool] = useState(filteredQuizzes[0].uses_access_code);
    const [accessCode, setAccessCode] = useState(filteredQuizzes[0].access_code);
    const [singleQuestion, setSingleQuestion] = useState(filteredQuizzes[0].single_question_at_a_time);
    const [webcamRequired, setWebcamRequired] = useState(filteredQuizzes[0].webcam);
    const [lockQuestions, setLockQuestions] = useState(filteredQuizzes[0].lock_after_answer);
    const [quizRd, setQuizRd] = useState(filteredQuizzes[0].available_date);
    const [quizDd, setQuizDd] = useState(filteredQuizzes[0].due_date);
    const [quizUd, setQuizUd] = useState(filteredQuizzes[0].until_date);
    
    const saveQuiz = async (quiz: any) => {
        await quizzesClient.updateQuiz(quiz);
        dispatch(updateQuiz(quiz));
      };
    
    const createQuizForCourse = async (title: string, quizInstruct: string, course: string, pts: string, quizType: string, quizGroup: string, shuffleAnswers: boolean, timeLimitBool: boolean, timeLimit: string, multipleAttempts: boolean, multipleAttemptLimit: string, showCorrectAnswers: boolean, accessCodeBool: boolean, accessCode: string, singleQuestion: boolean,webcamRequired: boolean, lockQuestions: boolean, releaseDate: string, dueDate: string, until_date: string) => {
        if (!cid) return;
        const newQuiz = { 
            published: false,
            title: title, 
            instructions: quizInstruct,
            course: course,  
            quiz_type: quizType, 
            points: pts,
            assignment_group: quizGroup, 
            shuffle_answers: shuffleAnswers, 
            time_limit_bool: timeLimitBool, 
            time_limit: timeLimit, 
            multiple_attempts: multipleAttempts, 
            attempts: multipleAttemptLimit,
            show_correct_answers: showCorrectAnswers, 
            uses_access_code: accessCodeBool, 
            access_code: accessCode, 
            single_question: singleQuestion,
            webcam_required: webcamRequired, 
            lock_questions: lockQuestions, 
            available_date: releaseDate, 
            due_date: dueDate,
            until_date: until_date,
            question_count: 0
        };
        const quiz = await coursesClient.createQuizForCourse(cid, newQuiz);
        dispatch(addQuiz(quiz));
    };

    return (
      <div id="wd-quizzes-editor">
        <Pills />
        <Form.Group as={Row} controlId="quiz-name" id="wd-name" className="mb-3">
            <Form.Label column sm={3}><b>Quiz Name</b></Form.Label>
            <Col sm={12}>
                <FormControl type="quiz-name" defaultValue={filteredQuizzes[0].title} onChange={ (e) => setQuizTitle(e.target.value) } ></FormControl>
            </Col>
        </Form.Group>
        

        <Form.Group as={Row} controlId="quiz-description" id="wd-description" className="mb-3">
            <Form.Label>Quiz Instructions</Form.Label>
            <Col sm={12}>
                <FormControl as='textarea' style={{ height : "400px", resize: "none" }} defaultValue="Please enter assignment description here..." onChange={(e) => setQuizInstructions(e.target.value)}/>
            </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="Points-for-quiz" id="wd-points" align="right" className="mb-3">
            <Form.Label column sm={3}><b>Points</b></Form.Label>
            <Col sm="9">
                <FormControl type="point-entry" defaultValue={filteredQuizzes[0].points} onChange={(e) => setQuizPoints(e.target.value)}></FormControl>
            </Col> 
        </Form.Group>

        <Form.Group as={Row} controlId="quiz-group" id="wd-group" align="right" className="mb-3">
            <Form.Label column sm={3}><b>Quiz Type</b></Form.Label>
            <Col sm={9}>
                <Form.Select defaultValue="GRADED QUIZ" onChange={(e) => setQuizType(e.target.value)}>
                    <option value="GRADED QUIZ">GRADED QUIZ</option>
                    <option value="PRACTICE QUIZ">PRACTICE QUIZ</option>
                    <option value="GRADED SURVEY">GRADED SURVEY</option>
                    <option value="UNGRADED SURVEY">UNGRADED SURVEY</option>
                </Form.Select>
            </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="quiz-group" id="wd-group" align="right" className="mb-3">
            <Form.Label column sm={3}><b>Assignment Group</b></Form.Label>
            <Col sm={9}>
                <Form.Select defaultValue="QUIZZES" onChange={(e) => setQuizGroup(e.target.value)}>
                    <option value="QUIZZES">QUIZZES</option>
                    <option selected value="EXAMS">EXAMS</option>
                    <option selected value="ASSIGNMENTS">ASSIGNMENTS</option>
                    <option value="PROJECT">PROJECT</option>
                </Form.Select>
            </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="display-grade" id="wd-display-grade-as" align="right" className="mb-3">
            <Form.Label column sm={3}><b>Display Grade as</b></Form.Label>
            <Col sm={9}>
                <Form.Select>
                    <option value="Percentage">Percentage</option>
                    <option value="Grade Point Average">Grade Point Average</option>
                    <option value="Total">Total</option>
                </Form.Select>
            </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="submission-type" id="wd-submission-type" align="right" className="mb-3">
            <Form.Label column sm={3}><b>Options</b></Form.Label>
            <Col sm={9}>
                <Form.Group className="editor-border">

                <Form.Group as={Row} controlId="submission-type" id="wd-submission-type" align="left" className="mb-3">
                    <Col sm={10}>
                        <Form.Check type="checkbox" id="wd-shuffle-answers" label="Shuffle Answers" checked={shuffleAnswers} onChange={(e) => setShuffleAnswers(e.target.checked)} />
                        <Form.Group id="wd-time-restriction" className="d-flex align-items-center">
                            <Form.Check type="checkbox" id="wd-time-limit" label="Time Limit" className="me-2" checked={timeLimitBool} onChange={(e) => setTimeLimitBool(e.target.checked)} />
                            <div className="d-flex align-items-center">
                                <FormControl id="time-box" as="textarea" defaultValue="20" style={{ height: "10px", width: "60px", resize: "none", lineHeight: "1", textAlign: "center", overflow: "hidden" }} className="me-1" onChange={(e) => setTimeLimit(e.target.value)} />
                                <Form.Label htmlFor="time-box" className="mb-0">Minutes</Form.Label>
                            </div>
                        </Form.Group>
                        <Form.Group id="wd-multiple-attempts" className="d-flex align-items-center">
                            <Form.Check type="checkbox" id="wd-multiple-attempts-boolean" label="Allow Multiple Attempts" checked={multipleAttempts} onChange={(e) => setMultipleAttempts(e.target.checked)} />
                            <div className="d-flex align-items-center">
                                <FormControl id="wd-multiple-attempts-number" as="textarea" defaultValue="20" style={{ height: "10px", width: "60px", resize: "none", lineHeight: "1", textAlign: "center", overflow: "hidden" }} className="me-1" onChange={(e) => setMultipleAttemptLimit(e.target.value)} />
                                <Form.Label htmlFor="time-box" className="mb-0">Attempts</Form.Label>
                            </div>
                        </Form.Group>
                        <Form.Check type="checkbox" id="wd-show-correct-answers" label="Show Correct Answers" checked={showCorrectAnswers} onChange={(e) => setShowCorrectAnswers(e.target.checked)} />
                        <Form.Group id="wd-access-code" className="d-flex align-items-center">
                            <Form.Check type="checkbox" id="wd-access" label="Access Code" className="me-2" checked={accessCodeBool} onChange={(e) => setAccessCodeBool(e.target.checked)} />
                            <div className="d-flex align-items-center">
                                <FormControl id="wd-code" as="textarea" defaultValue="20" style={{ height: "10px", width: "200px", resize: "none", lineHeight: "1", textAlign: "center", overflow: "hidden" }} className="me-1" onChange={(e) => setAccessCode(e.target.value)} />
                                <Form.Label htmlFor="wd-code" className="mb-0">Enter Access Code Here</Form.Label>
                            </div>
                        </Form.Group>
                        <Form.Check type="checkbox" id="wd-single-question" label="One Question At A Time" checked={singleQuestion} onChange={(e) => setSingleQuestion(e.target.checked)} />
                        <Form.Check type="checkbox" id="wd-webcam-required" label="Webcam Required" checked={webcamRequired} onChange={(e) => setWebcamRequired(e.target.checked)} />
                        <Form.Check type="checkbox" id="wd-lock-questions" label="Lock Questions After Answering" checked={lockQuestions} onChange={(e) => setLockQuestions(e.target.checked)} />
                    </Col>
                </Form.Group>
                </Form.Group>
                
            </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="submission-type" id="wd-submission-type" align="right" className="mb-3">
            <Form.Label column sm={3}><b>Assign</b></Form.Label>
            <Col sm={9}>
                <Form.Group className="editor-border">
                <Form.Group as={Row} controlId="assign-to" id="wd-assign-to" align="left">
                    <Form.Label column sm={3}><b>Assign to</b></Form.Label>
                    {/* How do I do this as a tag entry? */}
                    <Col sm={12}>
                        <Form.Control type="Select"></Form.Control>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="due-date" id="wd-due-date" align="left" className="md-3">
                    <Form.Label column sm={3}><b>Due</b></Form.Label>
                    <Col sm={12}>
                        <FormControl type="datetime" defaultValue={filteredQuizzes[0].due_date} onChange={(e) => setQuizDd(e.target.value)}/>
                    </Col>

                    <Form.Group controlId="availability-dates" className="md-3">
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="available-from" id="wd-available-from" className="md-3">
                                    <Form.Label><b>Available From</b></Form.Label>
                                    <FormControl type="datetime" defaultValue={filteredQuizzes[0].available_date} onChange={(e) => setQuizRd(e.target.value)}/>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="available-until-date" id="wd-available-until" className="md-3">
                                    <Form.Label><b>Until</b></Form.Label>
                                    <Form.Control type="datetime" defaultValue={filteredQuizzes[0].until_date} onChange={(e) => setQuizUd(e.target.value)}/> 
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form.Group>
                </Form.Group>
                </Form.Group>
            </Col>
        </Form.Group>
        <hr />
        <QuizEditorButtons 
        cid={cid} 
        
        addQuiz={() => {(updateOrAdd({qid: qid ?? "createNew", title: quizTitle, quizInstruct: quizInstructions, course: cid, points: quizPoints, quizType: quizType, quizGroup: quizGroup, shuffleAnswers: shuffleAnswers, timeLimitBool: timeLimitBool, timeLimit: timeLimit, multipleAttempts: multipleAttempts, multipleAttemptLimit: multipleAttemptLimit, showCorrectAnswers: showCorrectAnswers, accessCodeBool: accessCodeBool, accessCode: accessCode, singleQuestion: singleQuestion, webcamRequired: webcamRequired, lockQuestions: lockQuestions, release_date: quizRd, due_date: quizDd, until_date: quizUd}))}}/>
    </div>
  );} 
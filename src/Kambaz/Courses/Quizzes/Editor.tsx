import { useEffect, useState } from "react";
import { Col, Form, FormControl, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import * as coursesClient from "../client";
import * as quizzesClient from "./client";
import "./editor.css";
import Pills from "./Pills";
import QuizEditorButtons from "./QuizEditorButtons";
import { addQuiz, updateQuiz } from "./reducer";

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
            questionCount,
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
            questionCount: number,
            release_date: string; 
            due_date: string; 
            until_date: string;
            
        }
    ) {
        if (qid === "createNew") {
            createQuizForCourse(title, quizInstruct, course, points, quizType, quizGroup, shuffleAnswers, timeLimitBool, timeLimit, multipleAttempts, multipleAttemptLimit, showCorrectAnswers, accessCodeBool, accessCode, singleQuestion, webcamRequired, lockQuestions, questionCount, release_date, due_date, until_date);
        } else {
            saveQuiz({
                _id: qid, 
                title: title, 
                instructions: quizInstruct,
                course: course,  
                quizType: quizType, 
                points: points,
                assignmentGroup: quizGroup, 
                shuffleAnswers: shuffleAnswers, 
                timeLimitBool: timeLimitBool, 
                timeLimit: timeLimit, 
                allowMultipleAttempts: multipleAttempts, 
                attemptsAllowed: multipleAttemptLimit,
                showCorrectAnswers: showCorrectAnswers, 
                accessCodeBool: accessCodeBool, 
                accessCode: accessCode, 
                oneQuestionAtATime: singleQuestion,
                webcamRequired: webcamRequired, 
                lockAfterAnswer: lockQuestions, 
                questionCount: questionCount,
                due: due_date,
                availableFrom: release_date, 
                availableUntil: until_date,
            })
        }
    }

    if (filteredQuizzes.length === 0) {
        filteredQuizzes = [{ 
            _id: "createNew", 
            title: null, 
            instructions: null,
            course: cid,  
            quizType: "Graded Quiz", 
            points: 0,
            assignmentGroup: "Quizzes", 
            shuffleAnswers: true, 
            timeLimitBool: true, 
            timeLimit: "20", 
            allowMultipleAttempts: false, 
            attemptsAllowed: "1",
            showCorrectAnswers: true, //AND WHEN?
            accessCodeBool: false, 
            accessCode: "", 
            oneQuestionAtATime: true,
            webcamRequired: false, 
            lockAfterAnswer: false, 
            questionCount: 0,
            due: null,
            availableFrom: null, 
            availableUntil: null
        }]
    } 

    const [quizTitle, setQuizTitle] = useState(filteredQuizzes[0].title);
    const [quizInstructions, setQuizInstructions] = useState(filteredQuizzes[0].instructions);
    const [quizPoints, setQuizPoints] = useState(filteredQuizzes[0].points);
    const [quizType, setQuizType] = useState(filteredQuizzes[0].quizType);
    const [quizGroup, setQuizGroup] = useState(filteredQuizzes[0].assignmentGroup);
    const [shuffleAnswers, setShuffleAnswers] = useState(filteredQuizzes[0].shuffleAnswers);
    const [timeLimitBool, setTimeLimitBool] = useState(filteredQuizzes[0].timeLimitBool);
    const [timeLimit, setTimeLimit] = useState(filteredQuizzes[0].timeLimit);
    const [multipleAttempts, setMultipleAttempts] = useState(filteredQuizzes[0].allowMultipleAttempts);
    const [multipleAttemptLimit, setMultipleAttemptLimit] = useState(filteredQuizzes[0].attempts);
    const [showCorrectAnswers, setShowCorrectAnswers] = useState(filteredQuizzes[0].showCorrectAnswers);
    const [accessCodeBool, setAccessCodeBool] = useState(filteredQuizzes[0].accessCodeBool);
    const [accessCode, setAccessCode] = useState(filteredQuizzes[0].accessCode);
    const [singleQuestion, setSingleQuestion] = useState(filteredQuizzes[0].oneQuestionAtATime);
    const [webcamRequired, setWebcamRequired] = useState(filteredQuizzes[0].webcamRequired);
    const [lockQuestions, setLockQuestions] = useState(filteredQuizzes[0].lockAfterAnswer);
    const [questionCount, setQuestionCount] = useState(filteredQuizzes[0].questionCount);
    const [quizDd, setQuizDd] = useState(filteredQuizzes[0].due);
    const [quizRd, setQuizRd] = useState(filteredQuizzes[0].availableFrom);
    const [quizUd, setQuizUd] = useState(filteredQuizzes[0].availableUntil);
    
    const saveQuiz = async (quiz: any) => {
        await quizzesClient.updateQuiz(quiz);
        dispatch(updateQuiz(quiz));
    };

    const fetchPoints = async () => {
        if (qid != "createNew") {
            const points = await quizzesClient.pointCount(filteredQuizzes[0]._id);
            setQuizPoints(points.points);
        } 
    }

    const fetchQuestions = async () => {
        if (qid != "createNew") {
            const questions = await quizzesClient.questionCount(filteredQuizzes[0]._id);
            setQuestionCount(questions.value);
        }
    }

    useEffect(() => {
        fetchPoints();
        fetchQuestions();
    }, []); 

    const createQuizForCourse = async (title: string, quizInstruct: string, course: string, pts: string, quizType: string, quizGroup: string, shuffleAnswers: boolean, timeLimitBool: boolean, timeLimit: string, multipleAttempts: boolean, multipleAttemptLimit: string, showCorrectAnswers: boolean, accessCodeBool: boolean, accessCode: string, singleQuestion: boolean,webcamRequired: boolean, lockQuestions: boolean, questionCount: number, releaseDate: string, dueDate: string, until_date: string) => {
        if (!cid) return;
        const newQuiz = { 
            published: false,
            title: title, 
            instructions: quizInstruct,
            course: course,  
            quizType: quizType, 
            points: pts,
            assignmentGroup: quizGroup, 
            shuffleAnswers: shuffleAnswers, 
            timeLimitBool: timeLimitBool, 
            timeLimit: timeLimit, 
            allowMultipleAttempts: multipleAttempts, 
            attemptsAllowed: multipleAttemptLimit,
            showCorrectAnswers: showCorrectAnswers, 
            accessCodeBool: accessCodeBool, 
            accessCode: accessCode, 
            oneQuestionAtATime: singleQuestion,
            webcamRequired: webcamRequired, 
            lockAfterAnswer: lockQuestions,
            questionCount: questionCount,
            due: dueDate, 
            availableFrom: releaseDate, 
            availableUntil: until_date
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
                <FormControl type="quiz-name" defaultValue={quizTitle} onChange={ (e) => setQuizTitle(e.target.value) } ></FormControl>
            </Col>
        </Form.Group>
        

        <Form.Group as={Row} controlId="quiz-description" id="wd-description" className="mb-3">
            <Form.Label>Quiz Instructions</Form.Label>
            <Col sm={12}>
                <FormControl as='textarea' style={{ height : "400px", resize: "none" }} defaultValue={quizInstructions} onChange={(e) => setQuizInstructions(e.target.value)}/>
            </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="Points-for-quiz" id="wd-points" align="right" className="mb-3">
            <Form.Label column sm={3}><b>Points</b></Form.Label>
            <Col sm="9">
                <FormControl type="point-entry" defaultValue={quizPoints} onChange={(e) => setQuizPoints(e.target.value)}></FormControl>
            </Col> 
        </Form.Group>

        <Form.Group as={Row} controlId="quiz-group" id="wd-group" align="right" className="mb-3">
            <Form.Label column sm={3}><b>Quiz Type</b></Form.Label>
            <Col sm={9}>
                <Form.Select defaultValue={quizType} onChange={(e) => setQuizType(e.target.value)}>
                    <option value="Graded Quiz">GRADED QUIZ</option>
                    <option value="Practice Quiz">PRACTICE QUIZ</option>
                    <option value="Graded Survey">GRADED SURVEY</option>
                    <option value="Ungraded Survey">UNGRADED SURVEY</option>
                </Form.Select>
            </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="quiz-group" id="wd-group" align="right" className="mb-3">
            <Form.Label column sm={3}><b>Assignment Group</b></Form.Label>
            <Col sm={9}>
                <Form.Select defaultValue={quizGroup} onChange={(e) => setQuizGroup(e.target.value)}>
                    <option value="Quizzes">QUIZZES</option>
                    <option selected value="Exams">EXAMS</option>
                    <option selected value="Assignments">ASSIGNMENTS</option>
                    <option value="Project">PROJECT</option>
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
                                <FormControl id="wd-multiple-attempts-number" as="textarea" defaultValue={multipleAttemptLimit} style={{ height: "10px", width: "60px", resize: "none", lineHeight: "1", textAlign: "center", overflow: "hidden" }} className="me-1" onChange={(e) => setMultipleAttemptLimit(e.target.value)} />
                                <Form.Label htmlFor="time-box" className="mb-0">Attempts</Form.Label>
                            </div>
                        </Form.Group>
                        <Form.Check type="checkbox" id="wd-show-correct-answers" label="Show Correct Answers" checked={showCorrectAnswers} onChange={(e) => setShowCorrectAnswers(e.target.checked)} />
                        <Form.Group id="wd-access-code" className="d-flex align-items-center">
                            <Form.Check type="checkbox" id="wd-access" label="Access Code" className="me-2" checked={accessCodeBool} onChange={(e) => setAccessCodeBool(e.target.checked)} />
                            <div className="d-flex align-items-center">
                                <FormControl id="wd-code" as="textarea" defaultValue="" style={{ height: "10px", width: "200px", resize: "none", lineHeight: "1", textAlign: "center", overflow: "hidden" }} className="me-1" onChange={(e) => setAccessCode(e.target.value)} />
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
                        <FormControl type="datetime" defaultValue={quizDd} onChange={(e) => setQuizDd(e.target.value)}/>
                    </Col>

                    <Form.Group controlId="availability-dates" className="md-3">
                        <Row>
                            <Col md={6}>
                                <Form.Group controlId="available-from" id="wd-available-from" className="md-3">
                                    <Form.Label><b>Available From</b></Form.Label>
                                    <FormControl type="datetime" defaultValue={quizRd} onChange={(e) => setQuizRd(e.target.value)}/>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="available-until-date" id="wd-available-until" className="md-3">
                                    <Form.Label><b>Until</b></Form.Label>
                                    <Form.Control type="datetime" defaultValue={quizUd} onChange={(e) => setQuizUd(e.target.value)}/> 
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
        
        addQuiz={() => {console.log(multipleAttempts); (updateOrAdd({qid: qid ?? "createNew", title: quizTitle, quizInstruct: quizInstructions, course: cid, points: quizPoints, quizType: quizType, quizGroup: quizGroup, shuffleAnswers: shuffleAnswers, timeLimitBool: timeLimitBool, timeLimit: timeLimit, multipleAttempts: multipleAttempts, multipleAttemptLimit: multipleAttemptLimit, showCorrectAnswers: showCorrectAnswers, accessCodeBool: accessCodeBool, accessCode: accessCode, singleQuestion: singleQuestion, webcamRequired: webcamRequired, lockQuestions: lockQuestions, questionCount: questionCount, release_date: quizRd, due_date: quizDd, until_date: quizUd}))}}/>
    </div>
  );} 
import { Col, Form, FormControl, Row } from "react-bootstrap";
import QuizEditorButtons from "./QuizEditorButtons";
import { useParams } from "react-router";
import { updateQuiz, addQuiz } from "./reducer";
import "./editor.css";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import * as coursesClient from "../client";
import * as quizzesClient from "./client";

export default function QuizEditor({ cid }:
    {cid: string}
) {
    const { qid } = useParams();
    const { quizzes } = useSelector((state: any) => state.quizReducer);
    let filteredQuizzes = quizzes.filter((quiz: any) => quiz._id === qid);
    const dispatch = useDispatch();

    function updateOrAdd({qid, title, course, release_date, due_date, points}:
        {qid: string; title: string; course: string; release_date: string; due_date: string; points: string}
    ) {
        if (qid === "createNew") {
            createQuizForCourse(title, course, release_date, due_date, points);
        } else {
            saveQuiz({_id: qid, title: title, course: course, release_date: release_date, due_date: due_date, points: points})
        }
    }

    if (filteredQuizzes.length === 0) {
        filteredQuizzes = [{ _id: "createNew", title: null, course: null, release_date: null,  due_date: null, points: null}]
    } 

    const [quizTitle, setQuizTitle] = useState(filteredQuizzes[0].title);
    const [quizRd, setQuizRd] = useState(filteredQuizzes[0].release_date);
    const [quizDd, setQuizDd] = useState(filteredQuizzes[0].due_date);
    const [quizPoints, setQuizPoints] = useState(filteredQuizzes[0].points);
    
    const saveQuiz = async (quiz: any) => {
        await quizzesClient.updateQuiz(quiz);
        dispatch(updateQuiz(quiz));
      };
    

    const createQuizForCourse = async (title: string, course: string, release_date: string, due_date: string, points: string) => {
        if (!cid) return;
        const newQuiz = {title: title, course: course, release_date: release_date, due_date: due_date, points: points};
        const quiz = await coursesClient.createQuizForCourse(cid, newQuiz);
        dispatch(addQuiz(quiz));
    };

    return (
      <div id="wd-quizzes-editor">
        
        <Form.Group as={Row} controlId="quiz-name" id="wd-name" className="mb-3">
            <Form.Label column sm={3}><b>Quiz Name</b></Form.Label>
            <Col sm={12}>
                <FormControl type="quiz-name" defaultValue={filteredQuizzes[0].title} onChange={ (e) => setQuizTitle(e.target.value) } ></FormControl>
            </Col>
        </Form.Group>
        

        <Form.Group as={Row} controlId="quiz-description" id="wd-description" className="mb-3">
            <Form.Label>Quiz Instructions</Form.Label>
            <Col sm={12}>
                <FormControl as='textarea' style={{ height : "400px", resize: "none" }} defaultValue="Please enter assignment description here..."/>
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
                <Form.Select>
                    <option value="GRADED QUIZ">GRADED QUIZ</option>
                    <option selected value="PRACTICE QUIZ">PRACTICE QUIZ</option>
                    <option selected value="GRADED SURVEY">GRADED SURVEY</option>
                    <option value="UNGRADED SURVEY">UNGRADED SURVEY</option>
                </Form.Select>
            </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="quiz-group" id="wd-group" align="right" className="mb-3">
            <Form.Label column sm={3}><b>Assignment Group</b></Form.Label>
            <Col sm={9}>
                <Form.Select>
                    <option value="GRADED QUIZ">QUIZZES</option>
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
                        <Form.Check type="checkbox" id="wd-shuffle-answers" label="Shuffle Answers" />
                        <Form.Group id="wd-time-restriction" className="d-flex align-items-center">
                            <Form.Check type="checkbox" id="wd-time-limit" label="Time Limit" className="me-2"/>
                            <div className="d-flex align-items-center">
                                <FormControl id="time-box" as="textarea" defaultValue="20" style={{ height: "10px", width: "60px", resize: "none", lineHeight: "1", textAlign: "center", overflow: "hidden" }} className="me-1"/>
                                <Form.Label htmlFor="time-box" className="mb-0">Minutes</Form.Label>
                            </div>
                        </Form.Group>
                        <Form.Check type="checkbox" id="wd-multiple-attempts" label="Allow Multiple Attempts" />
                        <Form.Check type="checkbox" id="wd-show-correct-answers" label="Show Correct Answers" />
                        <Form.Group id="wd-access-code" className="d-flex align-items-center">
                            <Form.Check type="checkbox" id="wd-access" label="Access Code" className="me-2"/>
                            <div className="d-flex align-items-center">
                                <FormControl id="wd-code" as="textarea" defaultValue="20" style={{ height: "10px", width: "200px", resize: "none", lineHeight: "1", textAlign: "center", overflow: "hidden" }} className="me-1"/>
                                <Form.Label htmlFor="wd-code" className="mb-0">Enter Access Code Here</Form.Label>
                            </div>
                        </Form.Group>
                        <Form.Check type="checkbox" id="wd-single-question" label="One Question At A Time" />
                        <Form.Check type="checkbox" id="wd-webcam-required" label="Webcam Required" />
                        <Form.Check type="checkbox" id="wd-lock-questions" label="Lock Questions After Answering" />
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
                                    <FormControl type="datetime" defaultValue={filteredQuizzes[0].release_date} onChange={(e) => setQuizRd(e.target.value)}/>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="available-until-date" id="wd-available-until" className="md-3">
                                    <Form.Label><b>Until</b></Form.Label>
                                    <Form.Control type="datetime" /> 
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
        
        addQuiz={() => {(updateOrAdd({qid: qid ?? "createNew", title: quizTitle, course: cid, release_date: quizRd, due_date: quizDd, points: quizPoints}))}}/>
    </div>
  );} 
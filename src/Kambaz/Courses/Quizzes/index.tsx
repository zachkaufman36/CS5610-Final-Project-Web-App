import { FormControl, FormGroup, ListGroup } from "react-bootstrap";
import QuizControls from "./QuizControls";
import { BsGripVertical, BsSearch } from "react-icons/bs";
import QuizModuleControls from "./QuizModuleControls";
import { IoIosPaper } from "react-icons/io";
import "./index.css"
import QuizStatus from "./QuizStatus";
import { deleteQuiz, setQuizzes } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import EditProtection from "../../Account/EditProtection";
import QuizProtection from "./QuizProtection";
import * as coursesClient from "../client";
import * as quizzesClient from "./client";
import { useEffect } from "react";

export default function Quizzes( {cid} : { cid: string }) {
  const { quizzes } = useSelector((state: any) => state.quizReducer);
  const dispatch = useDispatch();

  const removeQuiz = async (quizId: string) => {
    await quizzesClient.deleteQuiz(quizId);
    dispatch(deleteQuiz(quizId));
  };

  const fetchQuizzes = async () => {
    const quizzes = await coursesClient.findQuizzesForCourse(cid! as string);
    dispatch(setQuizzes(quizzes));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchQuizzes();
    }, 100);
    return () => clearTimeout(timer);
  }, [cid]);

  function compareDates({ due_date, available_date }: { due_date: string; available_date: string }) {
    const currentDate = new Date();
    const quiz_due_date = new Date(due_date);
    const quiz_available_date = new Date(available_date);

    console.log(due_date);

    if (quiz_available_date > currentDate) {
      return "Not available until"
    }

    if (quiz_available_date < currentDate && quiz_due_date > currentDate) {
      return "Available"
    }

    if (quiz_due_date < currentDate) {
      return "Closed"
    }
  }

  function publishedOrNot() {
    if (QuizProtection()) {
      return (
        <div>
          { quizzes.map((quiz: any) => (            
            <ListGroup className="wd-lessons rounded-0">
            <ListGroup.Item className="wd-lesson p-3 ps-1" key={quiz._id}>
            <BsGripVertical className="me-2 fs-3" /> <IoIosPaper className="text-success me-2 fs-3"/> 
            
            <QuizName quizTitle={quiz.title} quizId={quiz._id} />
            <span> <b>{compareDates({due_date: quiz.due, available_date: quiz.availableFrom})} | </b> {quiz.availableFrom} | Due {quiz.due} | {quiz.points} pts | {quiz.questionCount} Questions </span> <QuizStatus quiz = {quiz} quizPublished={quiz.published} cid = {cid} quizId = {quiz._id}
            deleteQuiz={(quizId) => {removeQuiz(quizId)}}/> </ListGroup.Item>
          </ListGroup>
          )) }
        </div>
      )
    } else {
      return (
      <div>
        { quizzes.filter((quiz: any) => quiz.published).map((quiz: any) => (            
            <ListGroup className="wd-lessons rounded-0">
            <ListGroup.Item className="wd-lesson p-3 ps-1" key={quiz._id}>
            <BsGripVertical className="me-2 fs-3" /> <IoIosPaper className="text-success me-2 fs-3"/> 
            
            <QuizName quizTitle={quiz.title} quizId={quiz._id} />
            <span> <b>{compareDates({due_date: quiz.due, available_date: quiz.availableFrom})} | </b> {quiz.availableFrom} | Due {quiz.due} | {quiz.points} pts | {quiz.questionCount} Questions </span> <QuizStatus quiz = {quiz} quizPublished={quiz.published} cid = {cid} quizId = {quiz._id}
            deleteQuiz={(quizId) => {removeQuiz(quizId)}}/> </ListGroup.Item>
          </ListGroup>
          )) }
      </div>
      )
    }
  }

  function QuizName({quizId, quizTitle}: {quizId: string; quizTitle: string}) {
    if (QuizProtection()) {
      return (<a href={`#/Kambaz/Courses/${cid}/Quizzes/${quizId}`} className="wd-quiz-link" style={{ color: "black", textDecoration: "None"}}>
      <b>{quizTitle}</b>
    </a>)
    } else {
      return (<a className="wd-quiz-link" href={`#/Kambaz/Courses/${cid}/Quizzes/${quizId}`} style={{ color: "black", textDecoration: "None"}}>
        <b>{quizTitle}</b>
      </a>)
    }
  }
    return (
      <div id="wd-quizzes">
        <div className="d-flex align-items-center gap-3 mb-4">
          <FormGroup className="mb-0 flex-grow-1" controlId="searchbar" id="wd-search-quiz">
          <BsSearch className="wd-zindex-bring-to-front position-absolute fs-3" style={{top: '10.5%', left: '15.5%'}}/>
            <FormControl 
              type="search" 
              placeholder="Search..." 
              className="form-control-lg ps-5" 
              style={{ position : "relative", zIndex : 2 }}
            />
          </FormGroup>
          
          <div className="flex-shrink-0">
            <EditProtection>
            <QuizControls cid={cid} />
            </EditProtection>
          </div>
        </div>
        <ListGroup className="rounded-0" id="wd-modules">
          <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary"> <BsGripVertical className="me-2 fs-3" /> Quizzes <QuizModuleControls /> </div>
            
            {publishedOrNot()}
          </ListGroup.Item> 
        </ListGroup>
      </div>
  );}
  
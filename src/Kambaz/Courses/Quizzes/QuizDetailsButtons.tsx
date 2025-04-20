import { Button } from "react-bootstrap";
import { FaPencilAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function QuizDetailsButtons({ cid, qid } : { cid: string; qid: string }) {
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const navigate = useNavigate();

    function buttonSelector() {
        if (currentUser.role === "FACULTY") {
            return (
                <div>
                    <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-edit-quiz-btn" onClick={() => {navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/edit/details`)}}> 
                        <FaPencilAlt className="me-1"/>
                        Edit
                    </Button>

                    {/* INSERT ROUTE INTO TAKING THE QUIZ */}
                    <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-preview-quiz-btn" onClick={() => {navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/takeQuiz`)}}> 
                        Preview
                    </Button>
                </div>
            )
        }
        
        else {
            return (
                <div>
                    {/* INSERT ROUTE INTO TAKING THE QUIZ */}
                    <Button variant="danger" size="lg" className="me-1 float-end" id="wd-preview-quiz-btn" onClick={() => {navigate(`/Kambaz/Courses/${cid}/Quizzes/${qid}/takeQuiz`)}}> 
                        Take Quiz
                    </Button>
                </div>
            );
        }
    }

    return (
        <div className="text-center mb-4">
            <div className="d-flex justify-content-center mb-3">
                {buttonSelector()}
            </div>
            <hr className="border-2 border-secondary" />
        </div>
    );
}
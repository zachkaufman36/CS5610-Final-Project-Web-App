import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function QuizEditorButtons({ addQuiz, cid }: 
    {addQuiz: () => void; cid: string}) {
    const navigate = useNavigate();
    return (
    <div id="wd-quiz-editor-controls" className="text-nowrap">
        <Button variant="danger" size="lg" className="me-1 float-end" id="wd-save-quiz-btn" onClick={() => {addQuiz(); navigate(`/Kambaz/Courses/${cid}/Quizzes/`)}}> 
            Save
        </Button>
        <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-cancel-quiz-btn" onClick={() => navigate(`/Kambaz/Courses/${cid}/Quizzes/`)}> 
            Cancel
        </Button>
    </div>
    );}
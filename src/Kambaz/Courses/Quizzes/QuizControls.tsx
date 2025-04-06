import { FaPlus } from "react-icons/fa6";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";

export default function QuizControls( { cid }: { cid: string }) {
    const navigate = useNavigate();
    return (
        <div id="wd-quiz-controls" className="text-nowrap" >
            {/*This seems super wrong. It shouldn't just go to one course, it should go to any course. May need to fix this. Can style after EditorButtons*/}
            <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-quiz" onClick={() => {navigate(`/Kambaz/Courses/${cid}/Quizzes/createNew`)}}>
                <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                Quiz
            </Button> 
            <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-add-quiz-group">
                <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                Group
            </Button>
        </div>
    );
}
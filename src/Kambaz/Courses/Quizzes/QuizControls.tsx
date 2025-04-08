import { FaPlus } from "react-icons/fa6";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { IoEllipsisVertical } from "react-icons/io5";

export default function QuizControls( { cid }: { cid: string }) {
    const navigate = useNavigate();
    return (
        <div id="wd-quiz-controls" className="text-nowrap" > 
            <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-add-quiz-group">
                <IoEllipsisVertical className="position-relative me-2" style={{ bottom: "1px" }} />
            </Button>
            <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-quiz" onClick={() => {navigate(`/Kambaz/Courses/${cid}/Quizzes/createNew`)}}>
                <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                Quiz
            </Button>
        </div>
    );
}
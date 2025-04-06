import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function AssignmentEditorButtons({ addAssignment, cid }: 
    {addAssignment: () => void; cid: string}) {
    const navigate = useNavigate();
    return (
    <div id="wd-modules-controls" className="text-nowrap">
        <Button variant="danger" size="lg" className="me-1 float-end" id="wd-save-assignment-btn" onClick={() => {addAssignment(); navigate(`/Kambaz/Courses/${cid}/Assignments/`)}}> 
            Save
        </Button>
        <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-cancel-assignment-btn" onClick={() => navigate(`/Kambaz/Courses/${cid}/Assignments/`)}> 
            Cancel
        </Button>
    </div>
    );}
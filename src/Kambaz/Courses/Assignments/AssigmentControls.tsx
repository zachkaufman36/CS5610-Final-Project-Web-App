import { FaPlus } from "react-icons/fa6";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";

export default function AssignmentControls() {
    const navigate = useNavigate();
    return (
        <div id="wd-assignment-controls" className="text-nowrap" >
            <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-assignment" onClick={() => {navigate("/Kambaz/Courses/RS101/Assignments/createNew")}}>
                <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                Assignment
            </Button> 
            <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-add-assignment-group">
                <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                Group
            </Button>
        </div>
    );
}
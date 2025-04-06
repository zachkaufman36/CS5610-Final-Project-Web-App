import { Link } from "react-router-dom";
import { useParams, useLocation } from "react-router";
import { ListGroup } from "react-bootstrap";

export default function CourseNavigation() {
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];
  
  const { cid } = useParams();
  const { pathname } = useLocation();
  return (
    
    <ListGroup id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => (
        <ListGroup.Item as={Link} to={`/Kambaz/Courses/${cid}/` + link} id="wd-course-home-link"
        className=
        {`${pathname.includes(link) ? "list-group-item text-black border border-0" : "list-group-item text-danger border border-0"}`}>
          {link}</ListGroup.Item>     
      ))}
    </ListGroup>
  );}
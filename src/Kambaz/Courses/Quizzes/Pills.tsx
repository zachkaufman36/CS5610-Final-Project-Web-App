import Nav from "react-bootstrap/Nav";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export default function Pills() {
    const { pathname } = useLocation();
    const basePath = pathname.split('/').slice(0, -1).join('/');
      return (
        <Nav variant="pills" id="wd-toc">
            <Nav.Item>
                <Nav.Link as={Link} to={`${basePath}/details`} id="wd-details" active={!pathname.includes("questions")}>Details</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link as={Link} to={`${basePath}/questions`} id="wd-question-editor" active={pathname.includes("questions")}>Questions</Nav.Link>
            </Nav.Item>
        </Nav>
      );
    }
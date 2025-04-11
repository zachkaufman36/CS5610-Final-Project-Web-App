import { Button, Card, Col, FormControl, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { enroll, unenroll } from "./reducer";
import { useDispatch } from "react-redux";
import EditProtection from "./Account/EditProtection";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import * as enrollmentClient from "./client";

export default function Dashboard(
    { courses, enrolling, setEnrolling, course, setCourse, addNewCourse, updateCourse, deleteCourse }: {
    courses: any[]; 
    enrolling: boolean;
    setEnrolling: (enrolling: boolean) => void;
    course: any; 
    setCourse: (course: any) => void;
    addNewCourse: () => void; 
    updateCourse: () => void;
    deleteCourse: (courseId: any) => void; }
  ) {
  const [enrollments, setEnrollments] = useState<any>([]);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const dispatch = useDispatch();

  // This is happening, however you have to click enroll for it to properly display
  const unenrollUser = async (event: any, currentUser: any, course: any) => {
    event.preventDefault();
    await enrollmentClient.unenrollUserInCourse(currentUser, course);
    setEnrollments((prevEnrollments: any) => prevEnrollments.filter((enrollment: any) => !(enrollment.user === currentUser._id && enrollment.course === course._id)));
    dispatch(unenroll({userId: currentUser._id, courseId: course._id}))
  }

  const enrollUser = async (currentUser: any, course: any) => {
    const newEnrollment = await enrollmentClient.enrollUserInCourse(currentUser, course);
    setEnrollments([...enrollments, newEnrollment]);
    dispatch(enroll(newEnrollment));
  }

  const fetchEnrollments = async () => {
      const enrollments = await enrollmentClient.fetchAllEnrollments();
      setEnrollments(enrollments);
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  function ButtonsForTypeOfUser({ enrolling, setEnrolling }: { enrolling: boolean, setEnrolling: (value: boolean) => void }) {
    if (currentUser.role === "FACULTY") {
      return (<h5> New Course <button className="btn btn-primary float-end"
        id="wd-add-new-course-click"
        onClick={addNewCourse} > Add </button>
        <button className="btn btn-warning float-end me-2"
        onClick={updateCourse} id="wd-update-course-click">
        Update
        </button></h5>)
    } else if (currentUser.role === "STUDENT") {
      return (<button className="btn btn-primary float-end"
        id="wd-add-new-course-click"
        onClick={() => {setEnrolling(!enrolling)}}> Enrollment </button>)
    } else {
      return 
    }
  }

  type user = {
    _id: string,
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    role: string;
    loginId: string;
    section: string;
    lastActivity: string;
    totalActivity: string }

    type course = {
      _id: string;
    name: string;
    number: string;
    startDate: string;
    endDate: string;
    department: string;
    credits: number;
    description: string }

  function EnrollorUnEnroll({enrolling, user, course }: {enrolling: boolean; user: user; course: course}) {
    const isEnrolled = 
      enrollments.some(
        (enrollment: any) =>
          enrollment.user === user._id &&
          enrollment.course === course._id)

    if (enrolling) {
      if (!isEnrolled) {
        return (
          <div
              className="wd-dashboard-course-link text-decoration-none text-dark">
          <Card.Img variant="top" src="/images/reactjs.jpg" width="100%" height={160}/>
          <Card.Body className="card-body">
            <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">{course.name}</Card.Title>
            <Card.Text  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>{course.description}</Card.Text>
            <Button variant="primary">Go</Button>
        <button onClick={(event) => {
          event.preventDefault();
          enrollUser(user, course);
          fetchEnrollments();
        }} className="btn btn-success float-end"
        id="wd-delete-course-click">
        Enroll
        </button>
        </Card.Body>
        </div>)
      } else {
        return (
          <Link to={`/Kambaz/Courses/${course._id}/Home`}
              className="wd-dashboard-course-link text-decoration-none text-dark">
          <Card.Img variant="top" src="/images/reactjs.jpg" width="100%" height={160}/>
          <Card.Body className="card-body">
            <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">{course.name}</Card.Title>
            <Card.Text  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>{course.description}</Card.Text>
            <Button variant="primary">Go</Button>
        <button onClick={(event) => {  
          unenrollUser(event, user, course);
          fetchEnrollments();
        }} className="btn btn-danger float-end"
        id="wd-delete-course-click">
        Unenroll
        </button>
        </Card.Body>
        </Link>
        )
      } 
    } else {
      return (
        <Link to={`/Kambaz/Courses/${course._id}/Home`}
              className="wd-dashboard-course-link text-decoration-none text-dark">
          <Card.Img variant="top" src="/images/reactjs.jpg" width="100%" height={160}/>
          <Card.Body className="card-body">
            <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">{course.name}</Card.Title>
            <Card.Text  className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>{course.description}</Card.Text>
            <Button variant="primary">Go</Button>
          </Card.Body>
        </Link>
      )
    }
  }

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <ButtonsForTypeOfUser enrolling={enrolling} setEnrolling={setEnrolling} /><br />
      <EditProtection>
        <FormControl value={course.name} className="mb-2" 
          onChange={(e) => setCourse({ ...course, name: e.target.value }) } />
        <FormControl as = "textarea" value={course.description} rows={3} 
          onChange={(e) => setCourse({ ...course, description: e.target.value }) } /><hr />
      </EditProtection>

      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4" >
          {Array.isArray(courses) ? courses.map((course) => (
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
                <EnrollorUnEnroll enrolling={enrolling} user={currentUser} course={course}/>
                <EditProtection>
                <button onClick={(event) => {
                      event.preventDefault();
                      deleteCourse(course._id);
                    }} className="btn btn-danger float-end"
                    id="wd-delete-course-click">
                    Delete
                </button>

                <button id="wd-edit-course-click"
                  onClick={(event) => {
                    event.preventDefault();
                    setCourse(course);
                  }}
                  className="btn btn-warning me-2 float-end" >
                  Edit
                </button>
                </EditProtection>
                </Card>
          </Col>
          )) : <p>Loading courses...</p>}
        </Row>
      </div>
    </div>
);}
import Session from "./Account/Session";
import { Routes, Route, Navigate } from "react-router";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KambazNavigation from "./Navigation";
import Courses from "./Courses";
import "./styles.css"
import * as userClient from "./Account/client";
import * as courseClient from "./Courses/client";
import { useEffect, useState } from "react";
import ProtectedRoute from "./Account/ProtectedRoute";
import { useDispatch, useSelector } from "react-redux";
import { addCourse, updCourse, delCourse } from "./reducer";

export default function Kambaz() {
  const [courses, setCourses] = useState<any>([]);
  const [course, setCourse] = useState<any>({
    _id: "1234", name: "New Course", number: "New Number",
    startDate: "2023-09-10", endDate: "2023-12-15", description: "New Description",
  });
  const [enrolling, setEnrolling] = useState(false);

  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  
  const updateCourse = async () => {
    await courseClient.updateCourse(course);
    setCourses(courses.map((c: any) => {if (c._id === course._id) {  
      dispatch(updCourse(course))
      return course; 
    }
    else { return c; }}))
  };

  const deleteCourse = async (courseId: string) => {
    const status = await courseClient.deleteCourse(courseId);
    setCourses(courses.filter((course: any) => course._id !== courseId));
    dispatch(delCourse(courseId));
  };

  const fetchCourses = async () => {
    try {
      const courses = await userClient.findMyCourses();
      setCourses(courses);
    } catch (error) {
      console.error(error);
    }
  };
  
  const fetchAllCourses = async () => {
    try {
      const courses = await userClient.findAllCourses();
      setCourses(courses);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (enrolling) {
      fetchAllCourses();
    } else {
      fetchCourses();
    }
  }, [enrolling, currentUser]);

  const addNewCourse = async () => {
    const newCourse = await userClient.createCourse(course);
    setCourses([ ...courses, newCourse ]);
    dispatch(addCourse(newCourse));
  };

  return (
    <Session>
      <div id="wd-kambaz"> 
        <KambazNavigation />         
        <div className="wd-main-content-offset p-3">
          <Routes>
            <Route path="/" element={<Navigate to="Account" />} />
            <Route path="/Account/*" element={<Account />} />
            <Route path="/Dashboard" element={
              <ProtectedRoute>
              <Dashboard 
                courses={courses}
                enrolling={enrolling} 
                setEnrolling={setEnrolling}
                course={course}
                setCourse={setCourse}
                addNewCourse={addNewCourse}
                updateCourse={updateCourse}
                deleteCourse={deleteCourse}/></ProtectedRoute>} />
            <Route path="/Courses/:cid/*" element={<ProtectedRoute><Courses courses={courses}/></ProtectedRoute>} />
          </Routes>
        </div>           
      </div>
    </Session>
);}

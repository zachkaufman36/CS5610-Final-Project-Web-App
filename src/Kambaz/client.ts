import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const ENROLLMENT_API = `${REMOTE_SERVER}/api/Enrollments`;

export const fetchAllEnrollments = async () => {
    const { data } = await axios.get(ENROLLMENT_API);
    return data;
}

export const enrollUserInCourse = async (user: any, course: any) => {
    const response = await axios.post(`${ENROLLMENT_API}/${user._id}/${course._id}`);
    return response.data;
}

export const unenrollUserInCourse = async (user: any, course: any) => {
    const { data } = await axios.delete(`${ENROLLMENT_API}/${user._id}/${course._id}`);
    return data;
}
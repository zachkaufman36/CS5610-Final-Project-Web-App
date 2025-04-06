import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
    courses: [],
    enrollments: [],
}

const coursesSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        addCourse: (state, {payload: newCourse}) => {
            state.courses = [...state.courses, newCourse] as any;
        },

        delCourse: (state, {payload}) => {
            state.courses = state.courses.filter(
                (c: any) => c._id !== payload);
        },

        updCourse: (state, {payload: course}) => {
            state.courses = state.courses.map((c: any) =>
                c._id === course._id ? course : c
              ) as any;
        },

        enroll: (state, { payload }: { payload: { userId: string; courseId: string } }) => {
            const newEnrollment = {_id: uuidv4(), user: payload.userId, course: payload.courseId};
            state.enrollments = [...state.enrollments, newEnrollment] as any;
        },

        unenroll: (state, { payload }: { payload: { userId: string; courseId: string } }) => {
            state.enrollments = state.enrollments.filter((e: any) => 
                !(e.course === payload.courseId && e.user === payload.userId));
        }
    }
});

export const { addCourse, delCourse, updCourse, enroll, unenroll } =
  coursesSlice.actions;
export default coursesSlice.reducer;
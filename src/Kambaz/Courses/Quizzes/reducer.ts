import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
const initialState = {
    quizzes: [],
};

const assignmentsSlice = createSlice({
    name: "quizzes",
    initialState,
    reducers: {
        setQuizzes: (state, action) => {
            state.quizzes = action.payload;
        },

        addQuiz: (state, { payload: assignment }) => {
            const newAssignment: any = {
                _id: uuidv4(),
                title: assignment.title,
                course: assignment.course,
                release_date: assignment.release_date,
                due_date: assignment.due_date,
                points: assignment.points
              };
              state.quizzes = [...state.quizzes, newAssignment] as any;
        },
        
        deleteQuiz: (state, { payload: assignmentId }) => {
            state.quizzes = state.quizzes.filter(
                (a: any) => a._id !== assignmentId);
        },

        updateQuiz: (state, { payload: assignment }) => {   
            state.quizzes = state.quizzes.map((a: any) =>
                a._id === assignment._id ? assignment : a
              ) as any;
        },

        editQuiz: (state, { payload: moduleId }) => {
            state.quizzes = state.quizzes.map((a: any) =>
              a._id === moduleId ? { ...a, editing: true } : a
            ) as any;
          },

    },
})

export const { addQuiz, deleteQuiz, updateQuiz, editQuiz, setQuizzes } =
assignmentsSlice.actions;
export default assignmentsSlice.reducer;
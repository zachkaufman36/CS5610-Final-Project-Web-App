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
        
        deleteQuiz: (state, { payload: quizId }) => {
            state.quizzes = state.quizzes.filter(
                (q: any) => q._id !== quizId);
        },

        updateQuiz: (state, { payload: quiz }) => {   
            state.quizzes = state.quizzes.map((q: any) =>
                q._id === quiz._id ? quiz : q
              ) as any;
        },

        editQuiz: (state, { payload: quizId }) => {
            state.quizzes = state.quizzes.map((q: any) =>
              q._id === quizId ? { ...q, editing: true } : q
            ) as any;
          },

    },
})

export const { addQuiz, deleteQuiz, updateQuiz, editQuiz, setQuizzes } =
assignmentsSlice.actions;
export default assignmentsSlice.reducer;
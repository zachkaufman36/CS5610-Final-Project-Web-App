import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
const initialState = {
    quizzes: [],
};

const assignmentsSlice = createSlice({
    name: "quizzes",
    initialState,
    reducers: {
        setQuizzes: (state, {payload: quizzes}) => {
            state.quizzes = quizzes;
        },

        addQuiz: (state, { payload: quiz }) => {
              state.quizzes = [...state.quizzes, quiz] as any;
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
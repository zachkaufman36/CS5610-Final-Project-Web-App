import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
const initialState = {
    assignments: [],
};

const assignmentsSlice = createSlice({
    name: "assignments",
    initialState,
    reducers: {
        setAssignments: (state, action) => {
            state.assignments = action.payload;
        },

        addAssignment: (state, { payload: assignment }) => {
            const newAssignment: any = {
                _id: uuidv4(),
                title: assignment.title,
                course: assignment.course,
                release_date: assignment.release_date,
                due_date: assignment.due_date,
                points: assignment.points
              };
              state.assignments = [...state.assignments, newAssignment] as any;
        },
        
        deleteAssignment: (state, { payload: assignmentId }) => {
            state.assignments = state.assignments.filter(
                (a: any) => a._id !== assignmentId);
        },

        updateAssignment: (state, { payload: assignment }) => {   
            state.assignments = state.assignments.map((a: any) =>
                a._id === assignment._id ? assignment : a
              ) as any;
        },

        editAssignment: (state, { payload: moduleId }) => {
            state.assignments = state.assignments.map((a: any) =>
              a._id === moduleId ? { ...a, editing: true } : a
            ) as any;
          },

    },
})

export const { addAssignment, deleteAssignment, updateAssignment, editAssignment, setAssignments } =
assignmentsSlice.actions;
export default assignmentsSlice.reducer;
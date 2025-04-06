import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
import accountReducer from "./Account/reducer";
import assignmentReducer from "./Courses/Assignments/reducer";
import quizReducer from "./Courses/Quizzes/reducer";
import courseReducer from "./reducer";

const store = configureStore({
  reducer: {
    modulesReducer,
    accountReducer,
    assignmentReducer,
    courseReducer,
    quizReducer,
  },
});
export default store;
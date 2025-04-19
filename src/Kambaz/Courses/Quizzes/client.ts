import axios from 'axios';
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/Quizzes`;
const ATTEMPTS_API = `${REMOTE_SERVER}/api/attempts`;
const QUESTIONS_API = `${REMOTE_SERVER}/api/questions`;

export const deleteQuiz = async (quizId: string) => {
    const response = await axios.delete(`${QUIZZES_API}/${quizId}`);
    return response.data;
};

export const updateQuiz = async (quiz: any) => {
    const { data } = await axios.put(`${QUIZZES_API}/${quiz._id}`, quiz);
    return data;
};

export const getQuestions = async (quizId: any) => {
    const { data } = await axios.get(`${QUIZZES_API}/${quizId}/questions`);
    return data;
};

export const getAttempts = async (quizId: any, userId: any) => {
    const { data } = await axios.get(`${ATTEMPTS_API}/${quizId}/${userId}`);
    return data;
};

export const putAttempt = async (userId: any, quizId: any, attempt: any) => {
    const { data } = await axios.post(`${ATTEMPTS_API}/${quizId}/${userId}`, attempt);
    return data;
};

export const getMaxAttempts = async (quizId: any, userId: any) => {
    const { data } = await axios.get(`${ATTEMPTS_API}/max/${quizId}/${userId}`);
    return data;
};

export const getQuestion = async (qid: any) => {
    const { data } = await axios.get(`${QUESTIONS_API}/${qid}`);
    return data;
};

export const updateQuestion = async (qid: any, question: any) => {
    const { data } = await axios.put(`${QUESTIONS_API}/${qid}`, question);
    return data;
};

export const addQuestion = async (question: any) => {
    const { data } = await axios.post(`${QUESTIONS_API}/`, question);
    return data;
};

export const deleteQuestion = async (qid: any) => {
    const { data } = await axios.delete(`${QUESTIONS_API}/${qid}`);
    return data;
};
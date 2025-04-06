import { IoEllipsisVertical } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";
import EditProtection from "../../Account/EditProtection";

function deletePopup(
    { quizId, deleteQuiz }:
    { quizId: string; deleteQuiz: (assignmentId: string) => void; }) {
    if (confirm("Are you sure you want to delete this assignment?")) {
        deleteQuiz(quizId)
    }   
}
export default function QuizStatus(
    { quizId, deleteQuiz }:
    { quizId: string; deleteQuiz: (quizId: string) => void; }
    ) {
    return (
        <div className="float-end">
            <GreenCheckmark />  
            <EditProtection>
                <FaTrash className = "text-danger me-1" onClick={() => deletePopup({quizId, deleteQuiz})}/>
            </EditProtection>
            <IoEllipsisVertical className="fs-4" />
        </div>
    );
}
import { useState, useRef, useEffect } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";
import EditProtection from "../../Account/EditProtection";
import { Navigate, useNavigate } from "react-router";

function deletePopup(
  { quizId, deleteQuiz }: 
  { quizId: string; deleteQuiz: (quizId: string) => void; }
) {
  if (confirm("Are you sure you want to delete this quiz?")) {
    deleteQuiz(quizId);
  }
}

export default function QuizStatus(
  { cid, quizId, deleteQuiz }: 
  { cid: string; quizId: string; deleteQuiz: (quizId: string) => void; }
) {
  const navigate = useNavigate();
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const options = ["Edit", "Delete", "Publish"];
  
  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
  };
  
  const handleOptionSelect = (option: string) => {
    if (option === "Edit") {
      // Not going to the right place yet
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}`);
    }
    if (option === "Delete") {
      deletePopup({ quizId, deleteQuiz });
    }
    if (option === "Publish") {

    }
    setShowDropDown(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropDown(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <div className="float-end position-relative">
      <GreenCheckmark />
      <EditProtection>
        <FaTrash className="text-danger me-1" onClick={() => deletePopup({quizId, deleteQuiz})} />
      </EditProtection>
      <IoEllipsisVertical 
        className="fs-4 cursor-pointer" 
        onClick={toggleDropDown} 
        style={{ cursor: 'pointer' }}
      />
      
      {showDropDown && (
        <div 
          ref={dropdownRef}
          className="dropdown-menu show position-absolute" 
          style={{ right: 0, top: "100%", zIndex: 1000, minWidth: "120px" }}
        >
          {options.map((option, index) => (
            <button 
              key={index}
              className="dropdown-item"
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
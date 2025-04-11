import { useState, useRef, useEffect } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import GreenCheckmark from "./GreenCheckmark";
import CrossOutRed from "./CrossOut";
import EditProtection from "../../Account/EditProtection";
import { useNavigate } from "react-router";
import * as quizzesClient from "./client";
import { updateQuiz } from "./reducer";
import { useDispatch } from "react-redux";

function deletePopup(
  { quizId, deleteQuiz }: 
  { quizId: string; deleteQuiz: (quizId: string) => void; }
) {
  if (confirm("Are you sure you want to delete this quiz?")) {
    deleteQuiz(quizId);
  }
}

export default function QuizStatus(
  { cid, quizId, deleteQuiz, quiz }: 
  { cid: string; quizId: string; deleteQuiz: (quizId: string) => void; quizPublished: string; quiz: any }
) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [ published, setPublished ] = useState(quiz.published);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = ["Edit", "Delete", published ? "Unpublish" : "Publish"];

  const updatePublished = async (quiz: any) => {
    const newPublishedState = !published;
    setPublished(!published);
    const updQuiz = {...quiz, published: newPublishedState};
    await quizzesClient.updateQuiz(updQuiz);
    dispatch(updateQuiz(updQuiz));
  }
  
  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
  };
  
  const handleOptionSelect = (option: string) => {
    if (option === "Edit") {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${quizId}`);
    }

    else if (option === "Delete") {
      deletePopup({ quizId, deleteQuiz });
    }

    else {
      updatePublished(quiz);
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
      {published ? <GreenCheckmark /> : <CrossOutRed />}
      <EditProtection>     
        <IoEllipsisVertical 
          className="fs-4 cursor-pointer" 
          onClick={toggleDropDown} 
          style={{ cursor: 'pointer' }}
        />
      </EditProtection>
      
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
import { useSelector } from "react-redux";
export default function QuizProtection() {

    const { currentUser } = useSelector((state: any) => state.accountReducer)
    if (currentUser.role === "FACULTY") {
        return true;
    } else {
        return false;
    }
}
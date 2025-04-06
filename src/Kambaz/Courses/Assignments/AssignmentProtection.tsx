import { useSelector } from "react-redux";
export default function AssignmentProtection() {

    const { currentUser } = useSelector((state: any) => state.accountReducer)
    if (currentUser.role === "FACULTY") {
        return true;
    } else {
        return false;
    }
}
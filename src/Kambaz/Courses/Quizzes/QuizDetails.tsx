import { useParams } from "react-router";
import QuizDetailsButtons from "./QuizDetailsButtons";
import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";


export default function QuizDetails() {
    const { qid } = useParams();
    const { quizzes } = useSelector((state: any) => state.quizReducer);
    const filteredQuiz = quizzes.find((quiz: any) => quiz._id === qid);
    const dontDisplay = ['_id', 'published', 'title', 'course', 'due_date', 'available_date', 'until_date', 'access_code']

    function createTable() {
        const keysToDisplay = Object.keys(filteredQuiz).filter(key => !dontDisplay.includes(key));

        const formatKey = (key: string) => {
            return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        };

        const formatAnswer = (ans: string) => {
            if (ans === "true") {
                return "No"
            } else if (ans === "false") {
                return "Yes"
            } else {
                return ans
            }
        }

        return (
            <Table  className="mt-4 border-0">
              <tbody>
                {keysToDisplay.map(key => (
                  <tr className="border-0" key={key}>
                    <td className="fw-bold border-0" align="right">{formatKey(key)}</td>
                    <td className="border-0">{formatAnswer(filteredQuiz[key])}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          );
    }

    return (
        <div className="container">
            <QuizDetailsButtons cid={filteredQuiz.course} qid={filteredQuiz._id}/>
            <h1 className="my-4">{filteredQuiz.title}</h1>   
            <div>
                {createTable()}
            </div>
            <table className="w-100" style={{ borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Due</th>
                        <th>For</th>
                        <th>Available From</th>
                        <th>Until</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ borderTop: "1px solid #dee2e6", borderBottom: "1px solid #dee2e6" }}>
                        <td>{filteredQuiz.due_date}</td>
                        <td>filler</td>
                        <td>{filteredQuiz.available_date}</td>
                        <td>{filteredQuiz.until_date}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
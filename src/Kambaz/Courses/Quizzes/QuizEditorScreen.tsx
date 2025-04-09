import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import QuizEditor from './Editor';
import QuestionsEditor from './QuestionsEditor';

export default function QuizEditorScreeen({ qid }: { qid: string }) {
    const { pathname } = useLocation();

    const [step, setStep] = useState("Editor");

    return (
        <div id="wd-labs" className="container-fluid">
            <Nav variant="pills" id="wd-toc">
                <Nav.Item>
                    <span
                        className="nav-link"
                        id="wd-a1"
                        onClick={() => setStep('Editor')}
                        style={{ cursor: 'pointer' }}
                    >
                        Details
                    </span>
                </Nav.Item>
                <Nav.Item>
                    <span
                        className="nav-link"
                        id="wd-a1"
                        onClick={() => setStep('Questions')}
                        style={{ cursor: 'pointer' }}
                    >
                        Questions
                    </span>
                </Nav.Item>
            </Nav>
            <div>
                {step === '' ? (
                    <QuizEditor cid={qid} />
                ) : step === 'Editor' ? (
                    <QuizEditor cid={qid} />
                ) : (
                    <QuestionsEditor qid={qid} />
                )}
            </div>
        </div>
    );
}

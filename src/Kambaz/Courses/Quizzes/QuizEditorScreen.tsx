import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import QuizEditor from './Editor';
import QuestionsEditor from './QuestionsEditor';
import QuizzPreview from './QuizzPreview';

export default function QuizEditorScreeen({ qid }: { qid: string }) {
    const { pathname } = useLocation();

    const [step, setStep] = useState('Editor');

    return (
        <div id="wd-labs" className="container-fluid">
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <a
                        className={`nav-link ${
                            step === 'Editor' ? 'active text-danger' : 'text-black'
                        }`}
                        onClick={() => setStep('Editor')}
                    >
                        Editor
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link ${
                            step === 'Questions' ? 'active text-danger' : 'text-black'
                        }`}
                        onClick={() => setStep('Questions')}
                    >
                        Questions
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link ${
                            step === 'Preview' ? 'active text-danger' : 'text-black'
                        }`}
                        onClick={() => setStep('Preview')}
                    >
                        Preview
                    </a>
                </li>
            </ul>

            <div>
                {step === '' ? (
                    <QuizEditor cid={qid} />
                ) : step === 'Editor' ? (
                    <QuizEditor cid={qid} />
                ) : step === 'Preview' ? (
                    <QuizzPreview qid={qid} />
                ) : (
                    <QuestionsEditor qid={qid} />
                )}
            </div>
        </div>
    );
}

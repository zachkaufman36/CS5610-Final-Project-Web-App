
export default function QuestionsEditor({ qid }: { qid: any }) {
    
    const questions = [
        { id: 1, name: 'What is your name?', type: 'text' },
        { id: 2, name: 'What is your age?', type: 'number' },
        {
            id: 3,
            name: 'What is your favorite color?',
            type: 'multiple-choice',
            options: ['Red', 'Blue', 'Green'],
        },
    ];
    return (
        <div id="quiz-questions-editor">
            {/* Quizz controls */}
            <h1>Questions Editor</h1>
        </div>
    );
};
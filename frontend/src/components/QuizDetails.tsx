import quizcss from '../styles/quizcss.module.css';

interface QuizDetailsProps {
  quizData: {
    _id?: string;
    user_id: { _id: string; name: string };
    module_id: { _id: string; title: string };
    type: string;
    questions: string[];
    solved: boolean;
    timestamp: Date;
  };
  onMoreDetails: () => void;
  onRetake: (quiz_id: string) => void;
}

export default function QuizDetails({ quizData, onMoreDetails, onRetake }: QuizDetailsProps) {
  return (
    <div className={quizcss.container}>
      <div className={quizcss.card}>
        <h2 className={quizcss.title}>Quiz for {quizData.module_id?.title}</h2>
        <p className={quizcss.info}>Type: {quizData.type}</p>
        <p className={quizcss.info}>Created By: {quizData.user_id?.name || 'Unknown'}</p>
        <div className={quizcss.actions}>
          {!quizData.solved ? (
            <button onClick={onMoreDetails} className={quizcss.primaryButton}>
              Start Quiz
            </button>
          ) : (
            <div className={quizcss.solvedSection}>
              <p className={quizcss.info}>Quiz already solved</p>
              <button
                onClick={() => onRetake(quizData._id || '')}
                className={quizcss.secondaryButton}
              >
                Retake Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

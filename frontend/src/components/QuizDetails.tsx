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
    results?: {
      totalQuestions: number;
      correctAnswers: number;
      score: number; // Score percentage
    };
  };
  onMoreDetails: () => void;
  onRetake: (quiz_id: string) => void;

}

export default function QuizDetails({ quizData, onMoreDetails, onRetake }: QuizDetailsProps) {
  return (
    <div className={quizcss.quizContainer}>
      <div className={quizcss.quizDetails} key={quizData._id}>
        <h2>Quiz for {quizData.module_id?.title}</h2>
        <p className={quizcss.quizInfo}>Quiz Type: {quizData.type}</p>
        <p className={quizcss.quizInfo}>
          Created By: {quizData.user_id?.name || 'Unknown'}
        </p>
        <div className={quizcss.quizActions}>
          {!quizData.solved ? (
            <button onClick={onMoreDetails} className={quizcss.moreDetailsButton}>
              Start quiz
            </button>
          ) : (
            <div>
              <span className={quizcss.quizInfo}>Quiz already Solved</span>
              <button
                onClick={() => onRetake(quizData._id || '')}
                className={quizcss.moreDetailsButton}
              >
                Retake quiz?
              </button>
            </div>
          )}
        </div>
      </div>
      {quizData.results && (
        <div className={quizcss.quizReport}>
          <h3>Quiz Report</h3>
          <p>Total Questions: {quizData.results.totalQuestions}</p>
          <p>Correct Answers: {quizData.results.correctAnswers}</p>
          <p>Score: {quizData.results.score}%</p>
        </div>
      )}
    </div>
  );
}  

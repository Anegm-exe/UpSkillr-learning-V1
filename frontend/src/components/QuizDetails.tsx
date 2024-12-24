import styles from '@/styles/quizcss.module.css'; // Import CSS module

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
    <div className={styles.quizContainer}>
      <h2 className={styles.pageTitle}>Quiz for {quizData.module_id?.title}</h2>
      <div className={styles.quizDetails}>
        <p className={styles.quizInfo}>Type: {quizData.type}</p>
        <p className={styles.quizInfo}>Created By: {quizData.user_id?.name || 'Unknown'}</p>
      </div>
      <div className={styles.quizActions}>
        {!quizData.solved ? (
          <button onClick={onMoreDetails} className={styles.backButton}>
            Start Quiz
          </button>
        ) : (
          <div className={styles.solvedSection}>
            <p className={styles.quizInfo}>Quiz already solved</p>
            <button
              onClick={() => onRetake(quizData._id || '')}
              className={styles.moreDetailsButton}
            >
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

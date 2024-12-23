import progresscss from '../styles/progresscss.module.css';

interface ProgressDetailsProps {
  progressData: {
    _id?: string;
    user_id: {_id:string,name:string};
    course_id: {_id:string,title:string};
    completion_percentage: number;
    last_accessed: Date;
    completed_modules: { module_id: string; score: number }[];
    average_quiz?: number;
    opened_times: number;
  };
  onBack?: () => void;
  onMoreDetails?: () => void;
}

export default function ProgressDetails({ progressData, onBack, onMoreDetails }: ProgressDetailsProps) {
  return (
    <div className={progresscss.progressContainer}>
      <h1>Progress of {progressData.course_id?.title || 'N/A'} course</h1>
      {onBack? ( 
      <div className={progresscss.progressDetails}>
        <p className={progresscss.progressInfo}>Student name: {progressData.user_id?.name}</p>
        <p className={progresscss.progressInfo}>Course name: {progressData.course_id?.title}</p>
        <p className={progresscss.progressInfo}>
          Completion Percentage: {progressData.completion_percentage}%
        </p>
        <p className={progresscss.progressInfo}>
          Last Accessed: {new Date(progressData.last_accessed).toLocaleString()}
        </p>
        <p className={progresscss.progressInfo}>
          Average Quiz Score: {progressData.average_quiz ?? 'N/A'}
        </p>
        <p className={progresscss.progressInfo}>
          Opened Times: {progressData.opened_times}
        </p>
        <div className={progresscss.completedModules}>
          <h3>Completed Modules:</h3>
          {progressData.completed_modules?.length > 0 ? (
            <ul>
              {progressData.completed_modules.map((module, index) => (
                <li key={index}>
                  Module ID: {module.module_id}, Score: {module.score}
                </li>
              ))}
            </ul>
          ) : (
            <p>No modules completed yet.</p>
          )}
        </div>
        <button onClick={onBack} className={progresscss.backButton}>
            Back to Progress List
        </button>
      </div>
      ):(
        <button onClick={onMoreDetails} className={progresscss.backButton}>
            Check Out More Details
        </button>
      )}
    </div>
  );
}

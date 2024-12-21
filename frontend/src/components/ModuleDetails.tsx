import modulecss from '../styles/modulecss.module.css';

interface ModuleDetailsProps {
  moduleData: {
    _id: string;
    course_id: string;
    title: string;
    difficulty: string;
    resources: string[];
    category?: string[];
    no_questions?: number;
    type?: string;
    question_bank?: string[];
    quizzes?: string[];
    ratings?: number[];
  }[];
}

export default function ModuleDetails({ moduleData }: ModuleDetailsProps) {
  return (
    <div>
      {moduleData.map((module) => (
        <div key={module._id} className={modulecss.moduleContainer}>
          <h2 className={modulecss.moduleTitle}>Title: {module.title}</h2>
          <p className={modulecss.moduleInfo}>Difficulty: {module.difficulty}</p>
          <p className={modulecss.moduleInfo}>
            Resources: {module.resources.join(', ')}
          </p>
          {module.category && (
            <p className={modulecss.moduleInfo}>
              Category: {module.category.join(', ')}
            </p>
          )}
          {module.no_questions !== undefined && (
            <p className={modulecss.moduleInfo}>
              Number of Questions: {module.no_questions}
            </p>
          )}
          {module.type && (
            <p className={modulecss.moduleInfo}>Type: {module.type}</p>
          )}
          {module.question_bank && (
            <p className={modulecss.moduleInfo}>
              Question Bank: {module.question_bank.join(', ')}
            </p>
          )}
          {module.quizzes && (
            <p className={modulecss.moduleInfo}>
              Quizzes: {module.quizzes.join(', ')}
            </p>
          )}
          {module.ratings && (
            <p className={modulecss.moduleInfo}>
              Ratings: {module.ratings.join(', ')}
            </p>  
          )}
        </div>
      ))}
    </div>
  );
}


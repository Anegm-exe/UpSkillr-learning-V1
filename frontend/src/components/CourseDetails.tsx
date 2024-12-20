import coursecss from '../styles/coursecss.module.css';

interface CourseDetailsProps {
  courseData: {
    _id: string;
    title: string;
    description: string;
    instructor: string[];
    category: string[];
  };
  onBack: () => void;
}


export default function CourseDetails({courseData,onBack}: CourseDetailsProps) {
  return (
    <div className={coursecss.moduleContainer}>
      <h1>Course Information for Course ID: {courseData._id}</h1>
      <div className={coursecss.moduleDetails}>
        <h2 className={coursecss.moduleTitle}>Course Title: {courseData.title}</h2>
        <p className={coursecss.moduleInfo}>Description: {courseData.description}</p>
        <p className={coursecss.moduleInfo}>Instructor: {courseData.instructor}</p>
        <p className={coursecss.moduleInfo}>Category: {courseData.category}</p>
      </div>
      <button onClick={onBack} className={coursecss.backButton}>
        Back to Courses
      </button>
    </div>
  );
}

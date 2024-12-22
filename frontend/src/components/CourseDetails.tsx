import coursecss from "../styles/coursecss.module.css";
import Image from "next/image";
export interface Instructor {
  _id: string;
  name: string;
  profile_picture_url: string;
  dateOfBirth: string;
  role: string;
}

export interface CourseDetailsProps {
  courseData: {
    _id: string;
    title: string;
    description: string;
    category: string[];
    modules: string[];
    students: string[];
    rating: number;
    isArchived: boolean;
    instructor_ids: string[];
    difficulty_level: string;
  };
  instructors: Instructor[];
}

export default function CourseDetails({ courseData, instructors }: CourseDetailsProps) {
  return (
    <div className={coursecss.moduleContainer}>
      <h1>Course Information for Course ID: {courseData._id}</h1>
      <div className={coursecss.moduleDetails}>
        <h2 className={coursecss.moduleTitle}>Course Title: {courseData.title}</h2>
        <p className={coursecss.moduleInfo}>Description: {courseData.description}</p>
        <p className={coursecss.moduleInfo}>Category: {courseData.category}</p>
        <h3 className={coursecss.moduleSubtitle}>Instructors:</h3>
        <div className={coursecss.instructorsContainer}>
          {instructors.map((instructor: Instructor) => (
            <div key={instructor._id} className={coursecss.instructorCard}>
              <Image width={125} height={125} src={instructor.profile_picture_url} alt={instructor.name} className={coursecss.profilePic} />
              <div className={coursecss.instructorInfo}>
                <p className={coursecss.instructorName}>{instructor.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";
import dashboardcss from '../styles/dashboard.module.css';
import { useRouter } from 'next/navigation';


export interface CourseDetailsProps {
    courseData: {
        _id: string;
        title: string;
        description: string;
        instructor: string[];
        category: string[];
    };
}

export function AllCoursesDetails({ courseData }: CourseDetailsProps) {
    return (
        <div className={dashboardcss.courseTemplate}>
            <h1>{courseData.title}</h1>
            <p>Instructor: {courseData.instructor}</p>
            <p>Description: {courseData.description}</p>
            <p>Category: {courseData.category}</p>
        </div>
    );
}

export function EnrolledCourses({ courseData }: CourseDetailsProps) {
    const router = useRouter(); // Initialize the navigate function

    const handleCourseClick = () => {
        router.push(`/course/${courseData._id}`);
    };

    return (
        <li onClick={handleCourseClick}>
            {courseData.title}
        </li>
    );
}

export function CompletedCourses({ courseData }: CourseDetailsProps) {
    const router = useRouter(); // Initialize the navigate function

    const handleCourseClick = () => {
        router.push(`/course/${courseData._id}`);
    };

    return (
        <li onClick={handleCourseClick}>
            {courseData.title}
        </li>
    );
}
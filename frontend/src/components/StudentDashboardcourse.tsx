"use client";
import dashboardcss from '../styles/dashboard.module.css';
import { useRouter } from 'next/navigation';
import { useFetchCourseProgresses } from "../app/api/services/useFetchProgress";
import { useAuth } from "@/components/AuthContext";

interface CourseDetailsProps {
    courseData: {
        _id: string;
        title: string;
        description: string;
        instructor: string[];
        category: string[];
    };
}

interface ProgressDetailsProps {
    progressData: {
        _id?: string;
        user_id: { _id: string, name: string };
        course_id: { _id: string, title: string };
        completion_percentage: number;
        last_accessed: Date;
        completed_modules: { module_id: string; score: number }[];
        average_quiz?: number;
        opened_times: number;
    };
}

export function AllCoursesDetails({ courseData }: CourseDetailsProps) {
    const router = useRouter(); // Initialize the navigate function

    const { tokenDetails } = useAuth();
    const { progressData } = useFetchCourseProgresses(courseData._id, tokenDetails?._id);


    const handleCourseClick = () => {
        router.push(`/course/${courseData._id}`);
    };

    return (
        <div className={dashboardcss.courseTemplate} onClick={handleCourseClick}>
            <div className={dashboardcss.courseTemplateStates}>
                <div className={dashboardcss.progressradial}></div>
                <div className={dashboardcss.progresscircle} style={{ '--target-BG': `100% ${progressData.completion_percentage || 0}%` } as React.CSSProperties}></div>
                <h1>Completion: {progressData.completion_percentage}%</h1>
                <h1>Average Quiz Score: {progressData.average_quiz ?? 'N/A'}</h1>
            </div>
            <div className={dashboardcss.courseTemplatecontnet}>
                <h1>{courseData.title}</h1>
                <p>Description: {courseData.description}</p>
                <p>Category: {courseData.category}</p>
                <p>Instructor: {courseData.instructor}</p>
                <p>Last Accessed: {new Date(progressData.last_accessed).toLocaleString()}</p>
            </div>
        </div>
    );
}

export function EnrolledCourses({ courseData }: CourseDetailsProps) {
    const router = useRouter(); // Initialize the navigate function

    const { tokenDetails } = useAuth();
    const { progressData } = useFetchCourseProgresses(courseData._id, tokenDetails?._id);


    const handleCourseClick = () => {
        router.push(`/course/${courseData._id}`);
    };

    return (
        <li onClick={handleCourseClick}>
            {courseData.title}
            <div className={dashboardcss.progress}>
                <div className={dashboardcss.progressv} style={{ '--target-width': `${progressData.completion_percentage || 0}%` } as React.CSSProperties}></div>
            </div>
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
            <div className={dashboardcss.progress}>
                <div className={dashboardcss.progressv} style={{ '--target-width)': `100%` } as React.CSSProperties}></div>
            </div>
        </li>
    );
}
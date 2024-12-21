"use client";
import dashboardcss from '../styles/dashboard.module.css';
import { useRouter } from 'next/navigation';
import { useFetchCourseProgress } from "../app/api/services/useFetchProgress";
import { useFetchCourseCompletedStudents } from "../app/api/services/useFetchCourse";
import axios from "../app/api/axios";
import { useState } from 'react';
import { useAuth } from "@/components/AuthContext";

interface CourseDetailsProps {
    courseData: {
        _id: string;
        title: string;
        description: string;
        instructor_ids: string[];
        category: string[];
        students: string[];
        isArchived: boolean;
        rating: number;
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
    const { progressData } = useFetchCourseProgress(courseData._id, tokenDetails?._id);


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
                <p>Instructor: {courseData.instructor_ids.join(', ')}</p>
                <p>Last Accessed: {new Date(progressData.last_accessed).toLocaleString()}</p>
            </div>
        </div>
    );
}

export function EnrolledCourses({ courseData }: CourseDetailsProps) {
    const router = useRouter(); // Initialize the navigate function

    const { tokenDetails } = useAuth();
    const { progressData } = useFetchCourseProgress(courseData._id, tokenDetails?._id);


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

export function SupervisedCourses({ courseData }: CourseDetailsProps) {
    const router = useRouter(); // Initialize the navigate function

    const handleCourseClick = () => {
        router.push(`/course/${courseData._id}`);
    };

    return (
        <li onClick={handleCourseClick}>
            {courseData.title}
            <p>Enrolled Students: {courseData.students.length}</p>
        </li>
    );
}

export function DetailedSupervisedCourses({ courseData }: CourseDetailsProps) {
    const router = useRouter();
    const [isArchived, setIsArchived] = useState(courseData.isArchived);
    const { ccStudents, averagecoursescore } = useFetchCourseCompletedStudents(courseData._id);
    const toggleId = `toggle-${courseData._id}`;

    const handleCourseClick = () => {
        router.push(`/course/${courseData._id}`);
    };

    const handleToggle = async (newStatus: boolean) => {
        setIsArchived(newStatus);

        try {
            await axios.patch(`/course/${courseData._id}`, { isArchived: newStatus });
        } catch {
            console.error('Error fetching progresses data');
            setIsArchived(!newStatus);
        }
    };

    

    return (
        <div className={dashboardcss.courseTemplate} >
            <div className={dashboardcss.IcourseTemplate} onClick={handleCourseClick}>
                <h1>{courseData.title}</h1>
                <p>Description: {courseData.description}</p>
                <p>Category: {courseData.category}</p>
                <p>Instructors: {courseData.instructor_ids.join(', ')}</p>
                <p>AverageScore: {averagecoursescore}</p>
                <p>
                    {ccStudents.length === 0
                        ? "No Students Have Completed This Course"
                        : `${ccStudents.length} Student${ccStudents.length === 1 ? "" : "s"} ${ccStudents.length === 1 ? "Has" : "Have"
                        } Completed This Course`}
                </p>
            </div>
            <div className={dashboardcss.coursestatetext}>
                {isArchived ? "Archived" : "Active"}
            </div>
            <div className={dashboardcss.toggle}>
                <input type="checkbox" id={toggleId} className={dashboardcss.toggleinput} checked={!isArchived} onChange={() => handleToggle(!isArchived)} />
                <label htmlFor={toggleId} className={dashboardcss.togglelabel}>
                    <span className={dashboardcss.toggleslider}></span>
                </label>
            </div>
        </div>
    );
}
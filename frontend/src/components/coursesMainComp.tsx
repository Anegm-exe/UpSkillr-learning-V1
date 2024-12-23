import React from 'react';
import { FetchAllUserCourses, useFetchInstructorCourses, useFetchAllCourses } from "../app/api/services/useFetchForumsAN";
import CourseCss from "../styles/coursesmainpage.module.css";
import { useRouter } from "next/navigation";
import { useState } from 'react';

export interface CourseData {
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
}

export interface TokenDetails {
    _id: string;
    name: string;
    profile_picture_url: string;
    role: string;
}

function Admincourses() {
    const { allcoursessData } = useFetchAllCourses();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCourses = allcoursessData?.filter((course: CourseData) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            course.title.toLowerCase().includes(searchLower) ||
            course.description.toLowerCase().includes(searchLower) ||
            course._id.toLowerCase().includes(searchLower) ||
            course.category.some(cat => cat.toLowerCase().includes(searchLower))
        );
    });

    const handleCardClick = (courseId: string) => {
        router.push(`/course/${courseId}`);
    };

    return (
        <div className={CourseCss.container}>
            <div className={CourseCss.searchWrapper}>
                <input
                    type="text"
                    placeholder="Search courses by name, category, ID or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={CourseCss.searchInput}
                />
            </div>
            <div className={CourseCss.courseGrid}>
                {Array.isArray(filteredCourses) && filteredCourses.map((course: CourseData) => (
                    <div key={course._id} className={CourseCss.courseCard} onClick={() => handleCardClick(course._id)}>
                        <h3 className={CourseCss.courseTitle}>{course.title}</h3>
                        <div className={CourseCss.courseDetails}>
                            <p className={CourseCss.instructor}><span>Instructor:</span> {course.instructor_ids.join(', ')}</p>
                            <p className={CourseCss.description}><span>Description:</span> {course.description}</p>
                            <div className={CourseCss.categoryWrapper}>
                                <span>Categories:</span>
                                <div className={CourseCss.categories}>
                                    {course.category.map((cat, index) => (
                                        <p key={index} className={CourseCss.category}>{cat}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Update Student and Instructor components similarly
function Studentcourses({ tokenDetails }: { tokenDetails: TokenDetails }) {
    const { allcoursessData } = useFetchAllCourses();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCourses = allcoursessData?.filter((course: CourseData) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            course.title.toLowerCase().includes(searchLower) ||
            course.description.toLowerCase().includes(searchLower) ||
            course._id.toLowerCase().includes(searchLower) ||
            course.category.some(cat => cat.toLowerCase().includes(searchLower))
        );
    });

    const handleCardClick = (courseId: string) => {
        router.push(`/course/${courseId}`);
    };

    return (
        <div className={CourseCss.container}>
            <div className={CourseCss.searchWrapper}>
                <input
                    type="text"
                    placeholder="Search courses by name, category, ID or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={CourseCss.searchInput}
                />
            </div>
            <div className={CourseCss.courseGrid}>
                {Array.isArray(filteredCourses) && filteredCourses.map((course: CourseData) => (
                    <div key={course._id} className={CourseCss.courseCard} onClick={() => handleCardClick(course._id)}>
                        <h3 className={CourseCss.courseTitle}>{course.title}</h3>
                        <div className={CourseCss.courseDetails}>
                            <p className={CourseCss.instructor}><span>Instructor:</span> {course.instructor_ids.join(', ')}</p>
                            <p className={CourseCss.description}><span>Description:</span> {course.description}</p>
                            <div className={CourseCss.categoryWrapper}>
                                <span>Categories:</span>
                                <div className={CourseCss.categories}>
                                    {course.category.map((cat, index) => (
                                        <p key={index} className={CourseCss.category}>{cat}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Instructorcourses({ tokenDetails }: { tokenDetails: TokenDetails }) {
    const { superCourses } = useFetchInstructorCourses(tokenDetails._id);
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCourses = superCourses?.filter((course: CourseData) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            course.title.toLowerCase().includes(searchLower) ||
            course.description.toLowerCase().includes(searchLower) ||
            course._id.toLowerCase().includes(searchLower) ||
            course.category.some(cat => cat.toLowerCase().includes(searchLower))
        );
    });

    const handleCardClick = (courseId: string) => {
        router.push(`/course/${courseId}`);
    };

    return (
        <div className={CourseCss.container}>
            <div className={CourseCss.searchWrapper}>
                <input
                    type="text"
                    placeholder="Search courses by name, category, ID or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={CourseCss.searchInput}
                />
            </div>
            <div className={CourseCss.courseGrid}>
                {Array.isArray(filteredCourses) && filteredCourses.map((course: CourseData) => (
                    <div key={course._id} className={CourseCss.courseCard} onClick={() => handleCardClick(course._id)}>
                        <h3 className={CourseCss.courseTitle}>{course.title}</h3>
                        <div className={CourseCss.courseDetails}>
                            <p className={CourseCss.instructor}><span>Instructor:</span> {course.instructor_ids.join(', ')}</p>
                            <p className={CourseCss.description}><span>Description:</span> {course.description}</p>
                            <div className={CourseCss.categoryWrapper}>
                                <span>Categories:</span>
                                <div className={CourseCss.categories}>
                                    {course.category.map((cat, index) => (
                                        <p key={index} className={CourseCss.category}>{cat}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export { Admincourses, Studentcourses, Instructorcourses };
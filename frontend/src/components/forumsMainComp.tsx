import React from 'react';
import { useFetchAllForums, FetchAllUserCourses, useFetchInstructorCourses, useFetchAllCourses } from "../app/api/services/useFetchForumsAN";
import forumsCss from "../styles/forums.module.css";
import { useRouter } from "next/navigation";

export interface ForumData {
    _id: string;
    course_id: string;
    user_id: {
        _id: string;
        name: string;
        profile_picture_url: string;
    };
    title: string;
    messages: string[];
    timestamp: Date;
}

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

function Adminforums() {
    const { forumsData } = useFetchAllForums();
    const { allcoursessData } = useFetchAllCourses();
    const router = useRouter();

    const handleCardClick = (forumId: string) => {
        router.push(`/forums/${forumId}`); // Navigate to forum details page
    };

    if (!forumsData) {
        return <div>Loading forums...</div>;
    }

    return (
        <div className={forumsCss.container}>
            <h2 className={forumsCss.heading}>All Forums</h2>
            <div className={forumsCss.forumGrid}>
                {Array.isArray(forumsData) && forumsData.map((forum: ForumData) => (
                    <div key={forum._id} className={forumsCss.forumCard} onClick={() => handleCardClick(forum._id)}>
                        <h3 className={forumsCss.forumTitle}>{forum.title}</h3>
                        <div className={forumsCss.forumDetails}>
                            <p>Course: {
                                allcoursessData.find((course: CourseData) => course._id === forum.course_id)?.title
                            }</p>
                            <p style={{ 'fontSize': '.75rem', 'fontFamily': 'roboto-condensed', 'opacity': '.5' }}>{forum.course_id}</p>
                            <p>Created by: {forum.user_id.name}</p>
                            <p>Messages: {forum.messages.length}</p>
                            <p>Created: {new Date(forum.timestamp).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Update Student and Instructor components similarly
function Studentforums({ tokenDetails }: { tokenDetails: TokenDetails }) {
    // Always call hooks at the top level
    const { forumsData } = useFetchAllForums();
    const { userCourses } = FetchAllUserCourses();
    const router = useRouter();

    const handleCardClick = (forumId: string) => {
        router.push(`/forums/${forumId}`); // Navigate to forum details page
    };

    if (!forumsData || !userCourses) {
        return <div>Loading forums...</div>;
    }

    const filteredForums = forumsData.filter((forum: ForumData) =>
        userCourses.some((course: CourseData) => course._id === forum.course_id) || tokenDetails._id === forum.user_id._id
    );

    return (
        <div className={forumsCss.container}>
            <h2 className={forumsCss.heading}>My Course Forums</h2>
            <div className={forumsCss.forumGrid}>
                {Array.isArray(filteredForums) && filteredForums.map((forum: ForumData) => (
                    <div key={forum._id} className={forumsCss.forumCard} onClick={() => handleCardClick(forum._id)}>
                        <h3 className={forumsCss.forumTitle}>{forum.title}</h3>
                        <div className={forumsCss.forumDetails}>
                            <p>Course: {
                                userCourses.find((course: CourseData) => course._id === forum.course_id)?.title
                            }</p>
                            <p>Messages: {forum.messages.length}</p>
                            <p>Created: {new Date(forum.timestamp).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Instructorforums({ tokenDetails }: { tokenDetails: TokenDetails }) {
    const { forumsData } = useFetchAllForums();
    const { superCourses } = useFetchInstructorCourses(tokenDetails._id);
    const router = useRouter();

    const handleCardClick = (forumId: string) => {
        router.push(`/forums/${forumId}`); // Navigate to forum details page
    };

    if (!forumsData || !superCourses) {
        return <div>Loading forums...</div>;
    }

    const filteredForums = forumsData.filter((forum: ForumData) =>
        superCourses.some((course: CourseData) => course._id === forum.course_id) || tokenDetails._id === forum.user_id._id
    );

    return (
        <div className={forumsCss.container}>
            <h2 className={forumsCss.heading}>Course Forums</h2>
            <div className={forumsCss.forumGrid}>
                {Array.isArray(filteredForums) && filteredForums.map((forum: ForumData) => (
                    <div key={forum._id} className={forumsCss.forumCard} onClick={() => handleCardClick(forum._id)}>
                        <h3 className={forumsCss.forumTitle}>{forum.title}</h3>
                        <div className={forumsCss.forumDetails}>
                            <p>Course: {
                                superCourses.find((course: CourseData) => course._id === forum.course_id)?.title
                            }</p>
                            <p>Created by: {forum.user_id._id}</p>
                            <p>Messages: {forum.messages.length}</p>
                            <p>Created: {new Date(forum.timestamp).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export { Adminforums, Studentforums, Instructorforums };
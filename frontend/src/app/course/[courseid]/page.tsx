"use client";

import { useRouter } from 'next/navigation';
import { useFetchCourse } from '../../api/services/useFetchCourse';
import CourseDetails from '../../../components/CourseDetails';
import React from 'react';

export default function CoursePage({ params }: { params: { courseid: string } }) {
    const router = useRouter();
    // @ts-ignore
    const {courseid} = React.use(params);
    const { courseData, error } = useFetchCourse(courseid);

    if (error) return <div>Error: {error}</div>;
    if (!courseData) return <div>Loading...</div>;

    return (
        <CourseDetails courseData={courseData}/>
    );
}

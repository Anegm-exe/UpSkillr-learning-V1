/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export function useFetchCourse(courseId: string) {
    const [courseData, setCourseData] = useState<any>(null);
    const [errorM, setError] = useState<string | null>(null);

    useEffect(() => {
    if (courseId) {
        const fetchCourseData = async () => {
        try {
            const response = await axios.get(`/course/${courseId}`);
            setCourseData(response.data);
        } catch (errorM) {
            console.error('Error fetching course data:', errorM);
            setError('Failed to fetch course data.');
        }
        };

        fetchCourseData();
    }
    }, [courseId]);

    return { courseData, errorM };
}

export function useFetchUserCourses() {
    const [enrolledCourseData, setEnrolledCourseData] = useState<any>([]);
    const [completedCourseData, setCompletedCourseData] = useState<any>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response1 = await axios.get(`/course/completed`);
                const response2 = await axios.get(`/course/enrolled`);
                setEnrolledCourseData(response2.data);
                setCompletedCourseData(response1.data);
                console.log(response1.data);
            } catch (error) {
                console.error('Error fetching course data:', error);
                setError('Failed to fetch course data.');
            }
        };

        fetchCourseData();
    }, []);

    return { enrolledCourseData, completedCourseData, error };
}
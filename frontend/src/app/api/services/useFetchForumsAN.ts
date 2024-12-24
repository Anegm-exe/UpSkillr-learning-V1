'use client';

import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export interface CourseDetailsProps {
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

export interface ForumsDetailsProps {
    forumsdata: {
        _id: string;
        course_id: string;
        user_id: string;
        title: string;
        messages: string[];
        timestamp: Date;
    };
}

export function useFetchAllCourses() {
    const [allcoursessData, setallcoursessData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/course`);
                setallcoursessData(response.data);
            } catch (error) {
                console.error('Error fetching User Notifications:', error);
                setError('Failed to fetch User Notifications.');
            }
        };

        fetchData();
    }, []);

    return { allcoursessData, error };
}

export function useFetchAllForums() {
    const [forumsData, setforumsData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/forum`);
                setforumsData(response.data);
            } catch (error) {
                console.error('Error fetching User Notifications:', error);
                setError('Failed to fetch User Notifications.');
            }
        };

        fetchData();
    }, []);

    return { forumsData, error };
}

export function FetchAllUserCourses() {
    const [userCourses, setuserCourses] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response1 = await axios.get(`/course/completed`);
                const response2 = await axios.get(`/course/enrolled`);
                setuserCourses([...response1.data, ...response2.data]);
                console.log(userCourses);
            } catch (error) {
                console.error('Error fetching User Notifications:', error);
                setError('Failed to fetch User Notifications.');
            }
        };

        fetchData();
    }, []);

    return { userCourses, error };
}

// all courses a instructor gives
export function useFetchInstructorCourses(userId: string) {
    const [superCourses, setsuperCourses] = useState<any>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axios.get(`/course/instructor/${userId}`);
                setsuperCourses(response.data);
            } catch (error) {
                console.error("Error fetching course data:", error);
                setError("Failed to fetch course data.");
            }
        };

        fetchCourseData();
    }, [userId]);

    return { superCourses, error };
}
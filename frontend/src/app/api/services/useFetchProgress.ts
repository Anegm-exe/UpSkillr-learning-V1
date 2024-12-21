'use client';

import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export function useFetchUserProgresses(userId:string) {
    const [progressesData, setProgressData] = useState<any>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProgressData = async () => {
            try {
                const response = await axios.get(`/progress/user/${userId}`);
                setProgressData(response.data);
            } catch (error) {
                console.error('Error fetching progresses data:', error);
                setError('Failed to fetch progresses data.');
            }
        };

        fetchProgressData();
    }, [userId]);

    return { progressesData, error };
}

export function useFetchCourseProgresses(courseId:string,userId:string) {
    const [progressData, setProgressData] = useState<any>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProgressData = async () => {
            try {
                const response = await axios.get(`progress/course/${courseId}/user/${userId}`);
                setProgressData(response.data);
            } catch (error) {
                console.error('Error fetching progresses data:', error);
                setError('Failed to fetch progresses data.');
            }
        };

        fetchProgressData();
    }, [userId]);

    return { progressData, error };
}
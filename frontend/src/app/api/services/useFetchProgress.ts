/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import axios from '../../api/axios';


export function useFetchUserProgresses(userId:string) {
    const [progressesData, setProgressData] = useState<any>([]);

    useEffect(() => {
        const fetchProgressData = async () => {
            try {
                const response = await axios.get(`/progress/user/${userId}`);
                setProgressData(response.data);
            } catch {
                console.error('Error fetching progresses data');
            }
        };

        fetchProgressData();
    }, [userId]);

    return { progressesData };
}

export function useFetchCourseProgresses(courseId:string,userId:string) {
    const [progressData, setProgressData] = useState<any>([]);

    useEffect(() => {
        const fetchProgressData = async () => {
            try {
                const response = await axios.get(`progress/course/${courseId}/user/${userId}`);
                setProgressData(response.data);
                console.log(response.data.completion_percentage);
            } catch {
                console.error('Error fetching progresses data');
            }
        };

        fetchProgressData();
    }, [courseId ,userId]);

    return { progressData };
}
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import axios from '../../api/axios';

// Grap Course Using Its ID
export function useFetchCourse(courseId: string) {
    const [courseData, setCourseData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    if (courseId) {
        const fetchCourseData = async () => {
        try {
            const response = await axios.get(`/course/${courseId}`);
            setCourseData(response.data);
        } catch (error) {
            console.error('Error fetching course data:', error);
            setError('Failed to fetch course data.');
        }
        };

        fetchCourseData();
    }
    }, [courseId]);

    return { courseData, error };
}

// all coursses for a student
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
            } catch (error) {
                console.error('Error fetching course data:', error);
                setError('Failed to fetch course data.');
            }
        };

        fetchCourseData();
    }, []);

    return { enrolledCourseData, completedCourseData, error };
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
                console.error('Error fetching course data:', error);
                setError('Failed to fetch course data.');
            }
        };

        fetchCourseData();
    }, [userId]);

    return { superCourses, error };
}


// gets all the students who completed a certain course
export function useFetchCourseCompletedStudents(courseId: string) {
    const [ccStudents, setccStudents] = useState<any>([]);
    const [averagecoursescore, setaveragecoursescore] = useState<any>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axios.get(`/course/${courseId}/complete`);
                setccStudents(response.data);
                const response2 = await axios.get(`/course/${courseId}/student-preformance`);
                const performanceData = response2.data;

                const totalStudents =
                    performanceData.Below_average +
                    performanceData.Average +
                    performanceData.Above_Average +
                    performanceData.Excellent;

                if (totalStudents > 0) {
                    const weightedAverage =
                        (performanceData.Below_average * 1 +
                            performanceData.Average * 2 +
                            performanceData.Above_Average * 3 +
                            performanceData.Excellent * 4) /
                        totalStudents;

                    let scoreText = "Unknown";
                    if (weightedAverage <= 1.5) {
                        scoreText = "Poor";
                    } else if (weightedAverage <= 2.5) {
                        scoreText = "Average";
                    } else if (weightedAverage <= 3.5) {
                        scoreText = "Good";
                    } else {
                        scoreText = "Excellent";
                    }

                    setaveragecoursescore(scoreText + " " + weightedAverage);
                } else {
                    setaveragecoursescore(0); // Handle cases where no students have data
                }
            } catch (error) {
                console.error('Error fetching course data:', error);
                setError('Failed to fetch course data.');
            }
        };

        fetchCourseData();
    }, [courseId]);

    return { ccStudents, averagecoursescore, error };
}

// all courses in general
export function useFetchAllCourses() {
    const [AllCoursesdata, setAllCoursesdata] = useState<any>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axios.get(`/course`);
                setAllCoursesdata(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching course data:', error);
                setError('Failed to fetch course data.');
            }
        };

        fetchCourseData();
    }, );

    return { AllCoursesdata, error };
}

// all Users Data in general
export function useFetchAllUsers() {
    const [UsersData, setUsersData] = useState<any>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axios.get(`/user`);
                setUsersData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching course data:', error);
                setError('Failed to fetch course data.');
            }
        };

        fetchCourseData();
    },);

    return { UsersData, error };
}

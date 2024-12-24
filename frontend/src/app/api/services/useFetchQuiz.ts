/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from '../../api/axios';

interface quiz {
    _id?: string;
    user_id: { _id: string; name: string };
    module_id: { _id: string; title: string; course_id:string; };
    type: string;
    questions: string[];
    solved:boolean;
    timestamp: Date;
  };

// Grab Quiz Using Its ID
export function useFetchQuiz(quizId: string) {
    const [quizData, setQuizData] = useState<quiz | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    if (quizId) {
        const fetchQuizData = async () => {
        try {
            console.log(quizId)
            const response = await axios.get(`/quiz/${quizId}/details`);
            setQuizData(response.data);
        } catch (error) {
            console.error('Error fetching quiz data:', error);
            setError('Failed to fetch quiz data.');
        }
        };

        fetchQuizData();
    }
    }, [quizId]);

    return { quizData, error };
}

export function useFetchUserQuizzes(userId: string) {
    const [quizzesData, setQuizzesData] = useState<quiz[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;  // Early return if userId is not provided

        const fetchQuizzesData = async () => {
            try {
                const response = await axios.get(`/quiz/user/${userId}`);
                setQuizzesData(response.data);
            } catch (error) {
                console.error("Error fetching quiz data:", error);
                setError("Failed to fetch quiz data.");
            }
        }
        fetchQuizzesData()
    }, [userId]);

    // Return quizs data and error along with refetch function
    return { quizzesData, error};
}

export const useFetchRetakeQuiz = (quizId: string) => {
    const [quizData, setQuizData] = useState<quiz | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchQuizData = async () => {
        if (!quizId) return;

        setIsLoading(true);
        try {
            const response = await axios.get(`/quiz/${quizId}`);
            setQuizData(response.data);
        } catch (error) {
            console.error('Error fetching quiz data:', error);
            setError('Failed to fetch quiz data.');
        } finally {
            setIsLoading(false);
        }
    };

    return { quizData, error, isLoading, fetchQuizData };
};
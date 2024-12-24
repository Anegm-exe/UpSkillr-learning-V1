/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback} from 'react';
import axios from '../../api/axios';

// Grab Forum Using Its ID
export function useFetchForum(forumId: string) {
    const [forumData, setForumData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchForumData = useCallback(async () => {
        if (!forumId) return; 
        try {
            const response = await axios.get(`/forum/${forumId}`);
            console.log(response.data)
            setForumData(response.data);
        } catch (error) {
            console.error('Error fetching forum data:', error);
            setError('Failed to fetch forum data.');
        }
    },[forumId]);

    useEffect(() => {        
        fetchForumData();
    }, [fetchForumData]);

    return { forumData ,error,refetch: fetchForumData };
}
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from '../../api/axios';

// Grab Chat Using Its ID
export function useFetchChat(chatId: string) {
    const [chatData, setChatData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    if (chatId) {
        const fetchChatData = async () => {
        try {
            console.log(chatId)
            const response = await axios.get(`/chat/${chatId}`);
            setChatData(response.data);
        } catch (error) {
            console.error('Error fetching chat data:', error);
            setError('Failed to fetch chat data.');
        }
        };

        fetchChatData();
    }
    }, [chatId]);

    return { chatData, error };
}

export function useFetchUserChats(userId: string) {
    const [chatsData, setChatsData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchChatsData = useCallback(async () => {
        if (!userId) return;  // Early return if userId is not provided
        try {
            const response = await axios.get(`/chat/user/${userId}`);
            setChatsData(response.data);
        } catch (error) {
            console.error("Error fetching chat data:", error);
            setError("Failed to fetch chat data.");
        }
    }, [userId]);

    // Initial fetch when userId changes
    useEffect(() => {
        fetchChatsData();
    }, [fetchChatsData]);

    // Return chats data and error along with refetch function
    return { chatsData, error, refetch: fetchChatsData };
}

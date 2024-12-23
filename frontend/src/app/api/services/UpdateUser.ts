'use client';

import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export function useFetchNotifications(userId: string) {
    const [notificationsData, setNotificationsData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userId) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`/notifications/user/${userId}`);
                    setNotificationsData(response.data);
                } catch (error) {
                    console.error('Error fetching User Notifications:', error);
                    setError('Failed to fetch User Notifications.');
                }
            };

            fetchData();
        }
    }, [userId]);

    return { notificationsData, error };
}

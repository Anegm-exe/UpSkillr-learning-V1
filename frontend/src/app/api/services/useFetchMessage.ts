'use client';

import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export function useFetchMessage(messageId: string) {
  const [messageData, setMessageData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (messageId) {
      const fetchMessageData = async () => {
        try {
          const response = await axios.get(`/message/${messageId}`);
          setMessageData(response.data);
        } catch (error) {
          console.error('Error fetching message data:', error);
          setError('Failed to fetch message data.');
        }
      };

      fetchMessageData();
    }
  }, [messageId]);

  return { messageData, error };
}

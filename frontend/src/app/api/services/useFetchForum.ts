'use client';

import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export function useFetchForum(forumId: string) {
  const [forumData, setForumData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (forumId) {
      const fetchForumData = async () => {
        try {
          const response = await axios.get(`/forum/${forumId}`);
          setForumData(response.data);
        } catch (error) {
          console.error('Error fetching forum data:', error);
          setError('Failed to fetch forum data.');
        }
        
      };

      fetchForumData();
    }
  }, [forumId]);

  return { forumData, error };
}

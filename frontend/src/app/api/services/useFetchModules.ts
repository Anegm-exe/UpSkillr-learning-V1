'use client';

import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export function useFetchModules(courseId: string) {
  const [moduleData, setModuleData] = useState<any>(null);
  const [errorM, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      const fetchModuleData = async () => {
        try {
          const response = await axios.get(`/module/course/${courseId}`);
          console.log(response.data);
          setModuleData(response.data);
        } catch (error) {
          console.error('Error fetching module data:', error);
          setError('Failed to fetch module data.');
        }
      };

      fetchModuleData();
    }
  }, [courseId]);

  return { moduleData, errorM };
}

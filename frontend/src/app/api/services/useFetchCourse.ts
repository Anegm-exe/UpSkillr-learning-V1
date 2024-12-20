'use client';

import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export function useFetchCourse(courseId: string) {
  const [courseData, setCourseData] = useState<any>(null);
  const [errorC, setError] = useState<string | null>(null);

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

  return { courseData, errorC };
}

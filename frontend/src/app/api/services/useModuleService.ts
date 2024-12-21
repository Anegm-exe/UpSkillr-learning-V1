'use client';

import { useState, useEffect } from 'react';
import axios from '../../api/axios';

export function useModuleService(courseId: string) {
  const [moduleData, setModules] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      const fetchModules = async () => {
        try {
          const response = await axios.get(`/module/course/${courseId}`);
          setModules(response.data);
        } catch (error: any) {
          console.error('Error fetching modules:', error);
          setError(error.response?.data?.message || 'Failed to fetch modules.');
        }
      };

      fetchModules();
    }
  }, [courseId]);

  const createModule = async (courseId: string, moduleData: any) => {
    try {
      const response = await axios.post(`/module/course/add/${courseId}`, moduleData);
      setModules((prev) => [...prev, response.data]);
      return response.data;
    } catch (error: any) {
      console.error('Error creating module:', error);
      throw new Error(error.response?.data?.message || 'Failed to create module.');
    }
  };

  const deleteModule = async (moduleId: string) => {
    try {
      await axios.delete(`/module/${moduleId}`);
      setModules((prev) => prev.filter((module) => module._id !== moduleId));
    } catch (error: any) {
      console.error('Error deleting module:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete module.');
    }
  };

  return { moduleData, error, createModule, deleteModule };
}

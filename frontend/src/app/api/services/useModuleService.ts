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

  // it shows @Patch(':module_id/rate/:rating') how is it a unique rating?
  const addRating = async (moduleId: string, rating: number) => {
    try {
      const response = await axios.patch(`/module/${moduleId}/rating/`, { rating });
      setModules((prev) =>
        prev.map((module) =>
          module._id === moduleId ? { ...module, ratings: [...module.ratings, rating] } : module
        )
      );
      return response.data;
    } catch (error: any) {
      console.error('Error adding rating:', error);
      throw new Error(error.response?.data?.message || 'Failed to add rating.');
    }
  };

  const addQuestion = async (moduleId: string, question: string) => {
    try {
      const response = await axios.post(`/module/${moduleId}/add-questions`, { question });
      setModules((prev) =>
        prev.map((module) =>
          module._id === moduleId ? { ...module, question_bank: [...module.question_bank, question] } : module
        )
      );
      return response.data;
    } catch (error: any) {
      console.error('Error adding question:', error);
      throw new Error(error.response?.data?.message || 'Failed to add question.');
    }
  };

  const removeQuestion = async (moduleId: string, questionId: string, question: string) => {
    try {
      const response = await axios.delete(`/module/${moduleId}/remove-questions/${questionId}`, { data: { question } });
      setModules((prev) =>
        prev.map((module) =>
          //Check if its correct
          module._id === moduleId && questionId ? { ...module, question_bank: module.question_bank.filter((q: string) => q !== question) } : module
        )
      );
      return response.data;
    } catch (error: any) {
      console.error('Error removing question:', error);
      throw new Error(error.response?.data?.message || 'Failed to remove question.');
    }
  };

  const updateModule = async (moduleId: string, updatedData: any) => {
    try {
      const response = await axios.put(`/module/${moduleId}`, updatedData);
      setModules((prev) =>
        prev.map((module) =>
          module._id === moduleId ? { ...module, ...updatedData } : module
        )
      );
      return response.data;
    } catch (error: any) {
      console.error('Error updating module:', error);
      throw new Error(error.response?.data?.message || 'Failed to update module.');
    }
  };

  const findModuleById = async (moduleId: string) => {
    try {
      const response = await axios.get(`/module/${moduleId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error finding module:', error);
      throw new Error(error.response?.data?.message || 'Failed to find module.');
    }
  };

  return { moduleData, error, createModule, deleteModule, addRating, addQuestion, removeQuestion, updateModule, findModuleById };
}
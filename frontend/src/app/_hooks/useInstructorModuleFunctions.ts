export interface UpdateModuleDto {
  title?: string;
  difficulty?: string;
  no_question?: number;
  type?: string;
  resources?: string[];
  content_ids?: string[];
}

export interface CreateQuestionDto {
  title: string;
  options: string[];
  answer: number;
  difficulty: string;
  type: string;
}

export interface UpdateQuestionDto {
  title?: string;
  options?: string[];
  answer?: number;
  difficulty?: string;
  type?: string;
}

export interface Questions {
  _id?: string;
  title: string;
  type: string;
  options: string[];
  answer: number;
  difficulty: string;
}

export interface CreateModuleDto {
  course_id?: string;
  title: string;
  difficulty: string;
  no_question: number;
  type: string;
  resources?: string[];
  content_ids?: string[];
}

export interface CreateContentDto {
  title: string;
  description: string;
  fileType: string;
}

export interface UpdateContentDto {
  readonly title?: string;
  readonly url?: string;
  readonly desc?: string;
  readonly currentVersion?: number;
  readonly fileType: string;
}

import axios from "../api/axios";
export const useInstructorModuleFunctions = () => {
  const updateModule = async (moduleId: string, updateModuleDto: UpdateModuleDto) => {
    try {
      const response = await axios.patch(`/module/${moduleId}`, updateModuleDto);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update module: ${error.message}`);
    }
  };

  const addQuestion = async (moduleId: string, questionDto: CreateQuestionDto[]) => {
    try {
      const response = await axios.post(`/module/${moduleId}/add-questions`, questionDto);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add question: ${error.message}`);
    }
  };

  const updateQuestion = async (questionId: string, updateQuestionDto: UpdateQuestionDto) => {
    try {
      const response = await axios.put(`/question/${questionId}`, updateQuestionDto);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update question: ${error.message}`);
    }
  };

  const deleteQuestion = async (moduleId: string, questionId: string) => {
    try {
      const response = await axios.delete(`/module/${moduleId}/remove-questions/${questionId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to delete question: ${error.message}`);
    }
  };

  const deleteModule = async (moduleId: string) => {
    try {
      await axios.delete(`/module/${moduleId}`);
    } catch (error) {
      throw new Error(`Failed to delete module: ${error.message}`);
    }
  };

  const getQuestion = async (questionId: string): Promise<Questions> => {
    try {
      const response = await axios.get(`/question/${questionId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch question: ${error.message}`);
    }
  };

  const createModule = async (courseId: string, createModuleDto: CreateModuleDto) => {
    try {
      const response = await axios.post(`/module/course/add/${courseId}`, createModuleDto);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create module: ${error.message}`);
    }
  };

  const uploadContent = async (moduleId: string, createContentDto: CreateContentDto, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", createContentDto.title);
      formData.append("desc", createContentDto.description);
      formData.append("fileType", createContentDto.fileType);

      const response = await axios.post(`/content/upload/module/${moduleId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to upload content: ${error.message}`);
    }
  };

  const updateContent = async (contentId: string, updateContentDto: UpdateContentDto, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (updateContentDto.title) formData.append("title", updateContentDto.title);
      if (updateContentDto.desc) formData.append("desc", updateContentDto.desc);
      if (updateContentDto.fileType) formData.append("fileType", updateContentDto.fileType);

      const response = await axios.patch(`/content/${contentId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update content: ${error.message}`);
    }
  };

  const deleteContent = async (contentId: string, moduleId: string) => {
    try {
      await axios.delete(`/content/${contentId}/module/${moduleId}`);
    } catch (error) {
      throw new Error(`Failed to delete content: ${error.message}`);
    }
  };

  return {
    updateQuestion,
    updateModule,
    addQuestion,
    deleteQuestion,
    deleteModule,
    getQuestion,
    createModule,
    uploadContent,
    updateContent,
    deleteContent,
  };
};

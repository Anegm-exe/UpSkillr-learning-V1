import axios from "../api/axios";
export interface UpdateCourseDto {
  title?: string;
  description?: string;
  category?: string;
  difficulty_Level?: string;
}

export const useCourse = () => {
  const updateCourse = async (courseId: string, updateCourseDto: UpdateCourseDto) => {
    try {
      const response = await axios.patch(`/course/${courseId}`, updateCourseDto);

      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to update course: ${error.message}`);
    }
  };

  return { updateCourse };
};

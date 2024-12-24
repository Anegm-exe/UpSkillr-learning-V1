export interface Instructor {
  _id: string;
  name: string;
  profile_picture_url: string;
  dateOfBirth: string;
  role: string;
}

export interface CourseDetailsProps {
  courseData: {
    _id: string;
    title: string;
    description: string;
    category: string[];
    modules: string[];
    students: string[];
    rating: number;
    isArchived: boolean;
    instructor_ids: string[];
    difficulty_level: string;
  };
  instructors: Instructor[];
}

import { useState, useEffect } from "react";
import axios from "../api/axios";

export const useFetchCourse = (courseId: string) => {
  const [courseData, setCourseData] = useState<CourseDetailsProps["courseData"] | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseResponse = await axios.get(`/course/${courseId}`);
        const instructorResponse = await axios.get(`/user/instructor/course/${courseId}`);

        setCourseData(courseResponse.data);
        setInstructors(instructorResponse.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  return { courseData, instructors, loading, error };
};

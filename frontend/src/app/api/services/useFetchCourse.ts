/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import axios from "../../api/axios";

interface CourseDetailsProps {
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
}

type courseModuleProps = {
  _id: string;
  course_id: string;
  title: string;
  difficulty: string;
  resources: string[];
  content_ids: string[];
  no_question: number;
  type: string;
  question_bank: string[];
  quizzes: string[];
  timestamp: string;
  __v: number;
  ratings: number;
};

export function useFetchModulesForCourse(courseId: string) {
  const [moduleDetails, setModuleDetails] = useState<courseModuleProps[]>([]);
  const [instructor, setInstructor] = useState<any>([]);
  useEffect(() => {
    const fetchModuleData = async () => {
      const response = await axios.get(`module/course/${courseId}`);
      setModuleDetails(response?.data);
    };

    fetchModuleData();
  }, [courseId]);
  return moduleDetails;
}

export function useFetchCourse(courseId: string) {
  const [courseDetails, setCourseDetails] = useState<CourseDetailsProps>({
    courseData: {
      _id: "",
      title: "",
      description: "",
      instructor_ids: [],
      category: [],
      students: [],
      rating: 0,
      isArchived: false,
      difficulty_level: "",
      modules: [],
    },
  });
  const [instructor, setInstructor] = useState<any>([]);
  useEffect(() => {
    const fetchCourseData = async () => {
      const response = await axios.get(`/course/${courseId}`);
      const instructorResponse = await axios.get(`user/instructor/course/${courseId}`);
      setCourseDetails(response?.data);
      setInstructor(instructorResponse?.data);
    };

    fetchCourseData();
  }, [courseId]);
  return { courseDetails, instructor };
}

export function useFetchUserCourses() {
  const [enrolledCourseData, setEnrolledCourseData] = useState<any>([]);
  const [completedCourseData, setCompletedCourseData] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response1 = await axios.get(`/course/completed`);
        const response2 = await axios.get(`/course/enrolled`);
        setEnrolledCourseData(response2.data);
        setCompletedCourseData(response1.data);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setError("Failed to fetch course data.");
      }
    };

    fetchCourseData();
  }, []);

  return { enrolledCourseData, completedCourseData, error };
}

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

// Grap Course Using Its ID
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
  const [instructors, setInstructors] = useState<any>([]);
  useEffect(() => {
    const fetchCourseData = async () => {
      const response = await axios.get(`/course/${courseId}`);
      const instructorResponse = await axios.get(`user/instructor/course/${courseId}`);
      setCourseDetails(response?.data);
      setInstructors(instructorResponse?.data);
    };

    fetchCourseData();
  }, [courseId]);
  return { courseDetails, instructors };
}

// all coursses for a student
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

// all courses a instructor gives
export function useFetchInstructorCourses(userId: string) {
  const [superCourses, setsuperCourses] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`/course/instructor/${userId}`);
        setsuperCourses(response.data);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setError("Failed to fetch course data.");
      }
    };

    fetchCourseData();
  }, [userId]);

  return { superCourses, error };
}

// gets all the students who completed a certain course
export function useFetchCourseCompletedStudents(courseId: string) {
  const [ccStudents, setccStudents] = useState<any>([]);
  const [averagecoursescore, setaveragecoursescore] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`/course/${courseId}/complete`);
        setccStudents(response.data);
        const response2 = await axios.get(`/course/${courseId}/student-preformance`);
        const performanceData = response2.data;

        const totalStudents = performanceData.Below_average + performanceData.Average + performanceData.Above_Average + performanceData.Excellent;

        if (totalStudents > 0) {
          const weightedAverage =
            (performanceData.Below_average * 1 + performanceData.Average * 2 + performanceData.Above_Average * 3 + performanceData.Excellent * 4) /
            totalStudents;

          let scoreText = "Unknown";
          if (weightedAverage <= 1.5) {
            scoreText = "Poor";
          } else if (weightedAverage <= 2.5) {
            scoreText = "Average";
          } else if (weightedAverage <= 3.5) {
            scoreText = "Good";
          } else {
            scoreText = "Excellent";
          }

          setaveragecoursescore(scoreText + " " + weightedAverage);
        } else {
          setaveragecoursescore(0); // Handle cases where no students have data
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        setError("Failed to fetch course data.");
      }
    };

    fetchCourseData();
  }, [courseId]);

    return { ccStudents, averagecoursescore, error };
}

// all courses in general
export function useFetchAllCourses() {
    const [AllCoursesdata, setAllCoursesdata] = useState<any>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axios.get(`/course`);
                setAllCoursesdata(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching course data:', error);
                setError('Failed to fetch course data.');
            }
        };

        fetchCourseData();
    }, []);

    return { AllCoursesdata, error };
}

// all Users Data in general
export function useFetchAllUsers() {
    const [UsersData, setUsersData] = useState<any>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axios.get(`/user`);
                setUsersData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching course data:', error);
                setError('Failed to fetch course data.');
            }
        };

        fetchCourseData();
    },[]);

    return { UsersData, error };
}

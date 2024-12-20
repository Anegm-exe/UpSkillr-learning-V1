"use client";

import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import Link from "next/link";
import './CoursesPage.css';
import { useAuth } from "../../components/AuthContext";

const CoursesPage = () => {
  interface Course {
    _id: string;
    title: string;
    description: string;
    category: string;
    difficulty_Level: string;
    rating: number;
    isArchived: boolean;
  }

  const { tokenDetails } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [completedCourses, setCompletedCourses] = useState<Course[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/course/active');
        setCourses(response.data);
        setLoading(false);
      } catch {
        console.log("Error fetching courses");
        setLoading(false);
      }
    };

    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get('/course/enrolled');
        setEnrolledCourses(response.data);
      } catch {
        console.log("Error fetching enrolled courses");
        console.log(tokenDetails.role)
      }
    };

    const fetchCompletedCourses = async () => {
      try {
        const response = await axios.get('/course/completed');
        setCompletedCourses(response.data);
      } catch {
        console.log("Error fetching completed courses");
      }
    };

   

    fetchCourses();
    fetchEnrolledCourses();
    fetchCompletedCourses();
    if (tokenDetails && (tokenDetails.role === 'admin'||tokenDetails.role === 'instructor')) {
      fetchAllCourses();
    }
  }, [tokenDetails]);
  const fetchAllCourses = async () => {
    try {
      const response = await axios.get('/course');
      setAllCourses(response.data);
      console.log("Fetched all courses:", response.data); // Debugging log
    } catch {
      console.log("Error fetching all courses");
    }
  };

  const handleApply = async (courseId: string) => {
    try {
      const response = await axios.post(`/course/${courseId}/apply`);
      alert("Successfully applied to the course!");
    } catch {
      alert("An error occurred while applying to the course.");
    }
  };

  const handleChangeCourseStatus = async (courseId: string) => {
    try {
      const response = await axios.patch(`/course/${courseId}/status`);
      alert("Successfully changed the course status!");
      // Refresh the course data
      await fetchAllCourses();
    } catch {
      alert("An error occurred while changing the course status.");
    }
  };

  const handleSearchByName = async () => {
    try {
      if (searchTerm.trim() === "") {
        const response = await axios.get('/course/active');
        setCourses(response.data);
      } else {
        const response = await axios.get(`/course/searchName/${searchTerm}`);
        setCourses(response.data);
      }
    } catch {
      alert("An error occurred while searching for courses.");
    }
  };

  const handleSearchByCategory = async () => {
    try {
      if (searchTerm.trim() === "") {
        const response = await axios.get('/course/active');
        setCourses(response.data);
      } else {
        const response = await axios.get(`/course/searchCategory/${searchTerm}`);
        setCourses(response.data);
      }
    } catch {
      alert("An error occurred while searching for courses.");
    }
  };

  if (loading) return <div>Loading...</div>;

  

  return (
    <div>
      {(!tokenDetails || (tokenDetails.role !== 'admin' && tokenDetails.role !== 'instructor')) && (
        <div>
          <h1>All Courses</h1>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearchByName}>Search by Name</button>
          <button onClick={handleSearchByCategory}>Search by Category</button>
          <ul className="courses-list">
            {courses.map((course) => (
              <li
                key={course._id} // Ensure each child has a unique key prop
                className="course-box"
                onMouseEnter={() => setHoveredCourse(course._id)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                <div className="course-title">{course.title}</div>
                {hoveredCourse === course._id && (
                  <div className="course-details">
                    <p>{course.description}</p>
                    <p>{course.category}</p>
                    <p>{course.difficulty_Level}</p>
                    <button onClick={() => handleApply(course._id)}>Apply to Course</button>
                    <Link href={`/course/${course._id}`}>
                      Go to Course Page
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <div>
            <h2>Enrolled Courses</h2>
            <ul>
              {enrolledCourses.map((course) => (
                <li key={course._id}>{course.title}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Completed Courses</h2>
            <ul>
              {completedCourses.map((course) => (
                course && <li key={course._id}>{course.title}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {tokenDetails && (tokenDetails.role === 'admin'||tokenDetails.role === 'instructor') && (
        <div>
          <h2>Admin & Instructor Section</h2>
          <ul className="courses-list">
            {allCourses.map((course) => (
              <li
                key={course._id} // Ensure each child has a unique key prop
                className="course-box"
                onMouseEnter={() => setHoveredCourse(course._id)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                <div className="course-title">{course.title}</div>
                {hoveredCourse === course._id && (
                  <div className="course-details">
                    <p>{course._id}</p>
                    <p>{course.description}</p>
                    <p>{course.category}</p>
                    <p>{course.difficulty_Level}</p>
                    <p>{course.rating}</p>
                    <p>{course.isArchived ? "Inactive" : "Active"}</p>
                    <button onClick={() => handleChangeCourseStatus(course._id)}>Change Course Status</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
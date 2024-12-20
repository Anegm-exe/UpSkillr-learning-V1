"use client";

import React, { useState, useEffect } from "react";
import axios from "../../../api/axios";
import { useAuth } from "@/components/AuthContext";

const CreateCoursePage = () => {
  const { tokenDetails } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('Beginner');
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [analyticsData, setAnalyticsData] = useState<{ [key: string]: string }[]>([]);
  const [completedStudents, setCompletedStudents] = useState<string[]>([]);


  interface Course {
    _id: string;
    title: string;
  }

  useEffect(() => {
    const fetchCompletedStudents = async () => {
      try {
        const response = await axios.get('/course/instructor/test/CompleteInstructorStudents', {
          headers: {
            Authorization: `Bearer ${tokenDetails.token}`,
          },
        });
        console.log('Completed Students:', response.data);
        setCompletedStudents(response.data);
      } catch (error) {
        console.error('Error fetching completed students:', error);
      }
    };

    fetchCompletedStudents();
  }, [tokenDetails]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/course/exportanalytics/0'); // Adjust the URL and rating parameter as needed
        const parsedData = parseCSV(response.data);
        setAnalyticsData(parsedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const parseCSV = (csvData: string) => {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj: { [key: string]: string } = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      return obj;
    });
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const courseData = {
      title,
      description,
      category,
      difficulty_Level: difficultyLevel,
    };

    console.log('Course Data:', courseData);

    try {
      const response = await axios.post('/course', courseData);

      console.log('Response:', response);

      if (response.status === 201) {
        alert('Course created successfully!');
      } else {
        alert('Failed to create course. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/course/student/${searchInput}/course`);
      setEnrolledCourses(response.data);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };


  return (
    <div>
      <h1>Create Course</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Category:</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div>
          <label>Difficulty Level:</label>
          <select value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)} required>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <button type="submit">Create Course</button>
      </form>
       <div>
      <h2>Search Student Courses</h2>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Enter student ID"
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {enrolledCourses.map((course) => (
          <li key={course._id}>{course.title}</li>
        ))}
      </ul>
    </div>
    <div>
    <h1>Completed Students</h1>
        <ul>
          {completedStudents.map((studentId, index) => (
            <li key={index}>{studentId}</li>
          ))}
        </ul>
    </div>
    <div>
    <h1>Export Analytics</h1>
      <table>
        <thead>
          <tr>
            {analyticsData.length > 0 && Object.keys(analyticsData[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {analyticsData.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default CreateCoursePage;
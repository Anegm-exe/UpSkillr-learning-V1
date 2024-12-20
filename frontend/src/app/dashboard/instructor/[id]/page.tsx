"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/components/AuthContext";

const CreateCoursePage = () => {
  const { tokenDetails } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('Beginner');
  const [rating, setRating] = useState('');

  useEffect(() => {
    console.log('Token Details:', tokenDetails);
  }, [tokenDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const courseData = {
      title,
      description,
      category,
      difficulty_Level: difficultyLevel,
      rating: parseFloat(rating),
      userId: tokenDetails?._id, // Include user ID
      userRole: tokenDetails?.role, // Include user role
    };

    console.log('Course Data:', courseData);

    try {
      const response = await axios.post('http://localhost:3000/course', courseData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

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
        <div>
          <label>Rating:</label>
          <input type="number" step="1" value={rating} onChange={(e) => setRating(e.target.value)} required min="0" max="5" />
        </div>
        <button type="submit">Create Course</button>
      </form>
    </div>
  );
};

export default CreateCoursePage;
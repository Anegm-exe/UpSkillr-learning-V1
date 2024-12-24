import React, { useState } from "react";
import Image from "next/image";
import axios from "@/app/api/axios";
import { useAuth } from "./AuthContext";

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

export default function CourseDetails({ courseData, instructors }: CourseDetailsProps) {

  const [isPopupVisible, setPopupVisible] = useState(false);
    const [forumContent, setForumContent] = useState('');
      const { tokenDetails } = useAuth()
  

    const handleCreateForum = () => {
      setPopupVisible(true); // Show the popup
    };
  
    const handleSubmitForum = async () => {
      // Logic to submit the note
      await axios.post(`/forum/`,{
        user_id: tokenDetails?._id,
        course_id: courseData._id,
        title: forumContent
      })
      console.log('forum submitted:', forumContent);
  
      // Hide the popup after submitting
      setPopupVisible(false);
      setForumContent('');
    };

  return (
    <div className="p-6 bg-zinc-800 rounded-lg border border-zinc-700 shadow-lg text-center">
       {/* Add Buttons for Forum and Note Creation */}
       <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => handleCreateForum()}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
          >
            Create Forum
          </button>
        </div>
  
        {/* Popup for Note Creation */}
        {isPopupVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h3 className="text-lg font-medium mb-4">Create a Note</h3>
              <textarea
                value={forumContent}
                onChange={(e) => setForumContent(e.target.value)}
                placeholder="Enter forum content..."
                className="w-full h-32 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
              ></textarea>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setPopupVisible(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmitForum()}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                >
                  Submit Forum
                </button>
              </div>
            </div>
          </div>
        )}
      <h1 className="text-3xl font-bold text-white mb-6">Course Information</h1>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">{courseData.title}</h2>
        <p className="text-zinc-400">{courseData.description}</p>
        <p className="text-zinc-400">Category: {courseData.category.join(", ")}</p>
        <h3 className="text-xl font-medium text-white mt-6">Instructors</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {instructors.map((instructor: Instructor) => (
            <div key={instructor._id} className="bg-zinc-700 p-4 rounded-md flex items-center gap-4">
              <Image width={125} height={125} src={instructor.profile_picture_url} alt={instructor.name} className="rounded-full" />
              <div>
                <p className="text-white font-medium">{instructor.name}</p>
                <p className="text-zinc-400 text-sm">{instructor.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

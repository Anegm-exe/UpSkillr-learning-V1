import React, { useState } from "react";
import Image from "next/image";
import { useInstructorModuleFunctions } from "@/app/_hooks/useInstructorModuleFunctions";

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

export interface CreateModuleDto {
  course_id?: string;
  title: string;
  difficulty: string;
  no_question: number;
  type: string;
  resources?: string[];
  content_ids?: string[];
}

export default function InstructorCourseDetails({ courseData, instructors }: CourseDetailsProps) {
  const [moduleTitle, setModuleTitle] = useState<string>("");
  const [courseId, setCourseId] = useState<string>(courseData._id);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [noQuestion, setNoQuestion] = useState<number>(0);
  const [type, setType] = useState<string>("mcq");
  const [resources, setResources] = useState<string[]>([]);
  const [contentIds, setContentIds] = useState<string[]>([]);

  const { createModule } = useInstructorModuleFunctions();

  const handleCreateModule = async (courseId: string, createModuleDto: CreateModuleDto) => {
    try {
      await createModule(courseId, createModuleDto);
      alert("Module created successfully!");
    } catch (error) {
      console.error("Error creating module:", error);
    }
  };

  return (
    <div className="p-6 bg-zinc-800 rounded-lg border border-zinc-700 shadow-lg text-center">
      <h1 className="text-3xl font-bold text-white mb-6">Course Information</h1>
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">{courseData.title}</h2>
        <p className="text-zinc-400">{courseData.description}</p>
        <p className="text-zinc-400">Category: {courseData.category.join(", ")}</p>
        <h3 className="text-xl font-medium text-white mt-6">Instructors</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {instructors.map((instructor) => (
            <div key={instructor._id} className="bg-zinc-700 p-4 rounded-md flex items-center gap-4">
              <img src={instructor.profile_picture_url} alt={instructor.name} className="rounded-full w-16 h-16" />
              <div>
                <p className="text-white font-medium">{instructor.name}</p>
                <p className="text-zinc-400 text-sm">{instructor.role}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-medium text-white mb-4">Create Module</h3>
          <input
            type="text"
            placeholder="Module Title"
            className="bg-zinc-700 text-white rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent mb-4"
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
          />
          <select
            className="bg-zinc-700 text-white rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent mb-4"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <input
            type="number"
            placeholder="Number of Questions"
            className="bg-zinc-700 text-white rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent mb-4"
            value={noQuestion}
            onChange={(e) => setNoQuestion(Number(e.target.value))}
          />
          <select
            className="bg-zinc-700 text-white rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-accent mb-4"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="mcq">Multiple Choice</option>
            <option value="truefalse">True/False</option>
            <option value="both">Both</option>
          </select>
          <button
            onClick={() =>
              handleCreateModule(courseId, { title: moduleTitle, difficulty, no_question: noQuestion, type, resources, content_ids: contentIds })
            }
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md transition-colors"
          >
            Create Module
          </button>
        </div>
      </div>
    </div>
  );
}

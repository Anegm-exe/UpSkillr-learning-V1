import React from "react";
import Image from "next/image";

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
  return (
    <div className="p-6 bg-zinc-800 rounded-lg border border-zinc-700 shadow-lg text-center">
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

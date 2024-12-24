"use client";

import React from "react";
import { useModules } from "@/app/_hooks/useModules";
import { useFetchCourse } from "@/app/_hooks/useFetchCourse";
import CourseDetails from "@/components/CourseDetails";
import CourseModule from "@/components/CourseModule";
import InstructorCourseModule from "@/components/instructor/InstructorCourseModule";
import { useAuth } from "@/components/AuthContext";
import InstructorCourseDetails from "@/components/instructor/InstructorCourseDetails";

export default function CoursePage({ params }: { params: { courseid: string } }) {
  const { courseid } = React.use(params);
  const { tokenDetails } = useAuth();
  const { modules, loading: modulesLoading, error: modulesError } = useModules(courseid);
  const { courseData, instructors, loading: courseLoading, error: courseError } = useFetchCourse(courseid);

  if (modulesLoading || courseLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (modulesError || courseError) {
    return <div className="text-red-500">Error: {modulesError || courseError}</div>;
  }

  if (!courseData) {
    return <div className="text-red-500">Course data not found</div>;
  }

  if (tokenDetails?.role === "instructor") {
    return (
      <div className="p-4">
        <InstructorCourseDetails courseData={courseData} instructors={instructors} />
        <h1 className="text-2xl font-bold mb-4">Course Modules</h1>
        <div className="space-y-4">
          {modules.map((module) => (
            <InstructorCourseModule key={module._id} module={module} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <CourseDetails courseData={courseData} instructors={instructors} />
      <h1 className="text-2xl font-bold mb-4">Course Modules</h1>
      <div className="space-y-4">
        {modules.map((module) => (
          <CourseModule key={module._id} module={module} />
        ))}
      </div>
    </div>
  );
}

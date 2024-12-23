"use client";
import { useFetchCourse, useFetchModulesForCourse } from "@/app/api/services/useFetchCourse";
import { useAuth } from "@/components/AuthContext";
import CourseDetails from "@/components/CourseDetails";
import CourseModule from "@/components/CourseModule";
import { useModuleService } from "@/app/api/services/useModuleService";
import ModuleDetails from "../../../components/ModuleDetails";
import CreateModule from "../../../components/CreateModule";
import React, { useState, useEffect } from "react";
import InstructorPage from "./InstructorPage";
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
  ratings: number[];
};

export default function CoursePage({ params }: { params: { courseid: string } }) {
  //@ts-expect-error
  const { courseid } = React.use(params);
  const { courseDetails, instructors } = useFetchCourse(courseid);
  const modules = useFetchModulesForCourse(courseid);
  const { tokenDetails } = useAuth();
  if (tokenDetails?.role === "instructor") {
    return <InstructorPage courseId={courseid} />;
  }
  return (
    <div>
      <CourseDetails courseData={courseDetails} instructors={instructors} />
      {modules.map((module) => {
        return <CourseModule module={module} key={module._id} />;
      })}
    </div>
  );
}

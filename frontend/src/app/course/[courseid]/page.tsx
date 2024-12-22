/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import { useFetchCourse, useFetchModulesForCourse } from "@/app/api/services/useFetchCourse";
import CourseDetails from "@/components/CourseDetails";
import CourseModule from "@/components/CourseModule";
import React from "react";

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
  const { courseDetails } = useFetchCourse(courseid);
  const modules = useFetchModulesForCourse(courseid);
  console.log(modules);
  return (
    <div>
      <CourseDetails courseData={courseDetails} />
      {modules.map((module) => {
        return <CourseModule module={module} key={module._id} />;
      })}
    </div>
  );
}

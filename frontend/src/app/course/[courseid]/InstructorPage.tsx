"use client";

import React, { useState } from "react";
import { useFetchCourse, useFetchModulesForCourse } from "@/app/api/services/useFetchCourse";
import CourseDetails from "@/components/CourseDetails";
import CreateModule from "@/components/CreateModule";
import ModuleDetails from "@/components/ModuleDetails";
import { useModuleService } from "@/app/api/services/useModuleService";
import instructorcss from "../../../styles/instructorcss.module.css";
interface InstructorPageProps {
  courseId: string;
}

const InstructorPage: React.FC<InstructorPageProps> = ({ courseId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modules = useFetchModulesForCourse(courseId);
  const { createModule, addRating, addQuestion, removeQuestion, updateModule } = useModuleService(courseId);

  const { courseDetails, instructors } = useFetchCourse(courseId);

  const handleModalToggle = () => setIsModalOpen((prev) => !prev);

  if (!courseDetails || !courseId) return <div>Loading...</div>;

  return (
    <div>
      <CourseDetails courseData={courseDetails} instructors={instructors} />
      <button className={instructorcss.addModule} onClick={handleModalToggle}>
        Create Module
      </button>
      {isModalOpen && <CreateModule courseId={courseId} onClose={handleModalToggle} createModule={createModule} />}
      {modules.map((module) => (
        <ModuleDetails
          key={module._id}
          moduleData={module}
          addRating={addRating}
          addQuestion={addQuestion}
          updateModule={updateModule}
          removeQuestion={removeQuestion}
          onClose={handleModalToggle}
        />
      ))}
    </div>
  );
};

export default InstructorPage;

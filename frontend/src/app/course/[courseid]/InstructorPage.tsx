"use client";

import React, { useState } from "react";
import { useFetchCourse, useFetchModulesForCourse } from "@/app/api/services/useFetchCourse";
import CourseDetails from "@/components/CourseDetails";
import CourseModule from "@/components/CourseModule";
import { useModuleService } from "@/app/api/services/useModuleService";
import CreateModule from "../../../components/CreateModule";
import ModuleDetails from "@/components/ModuleDetails";

interface InstructorPageProps {
  courseId: string;
}

const InstructorPage: React.FC<InstructorPageProps> = ({ courseId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modules = useFetchModulesForCourse(courseId);
  const {
    error: moduleError,
    createModule,
    deleteModule,
    addRating,
    addQuestion,
    removeQuestion,
    updateModule,
    findModuleById,
  } = useModuleService(courseId || "");
  const { courseDetails, instructors } = useFetchCourse(courseId || "");

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  if (!courseDetails || !courseId) return <div>Loading...</div>;

  return (
    <div>
      <CourseDetails courseData={courseDetails} instructors={instructors} />
      <button onClick={handleOpenModal}>Create Module</button>
      {isModalOpen && <CreateModule courseId={courseId} onClose={handleCloseModal} createModule={createModule} />}
      {modules.map((module) => (
        // <CourseModule key={module._id} module={module} />
        <ModuleDetails
          key={module?._id}
          moduleData={module}
          addRating={addRating}
          addQuestion={addQuestion}
          updateModule={updateModule}
          removeQuestion={removeQuestion}
          onClose={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      ))}
    </div>
  );
};

export default InstructorPage;

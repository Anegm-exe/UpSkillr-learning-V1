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
  const { courseDetails, instructors } = useFetchCourse(courseid);
  const modules = useFetchModulesForCourse(courseid);
  console.log(modules);
  return (
    <div>
      <CourseDetails courseData={courseDetails} instructors={instructors} />
      {modules.map((module) => {
        return <CourseModule module={module} key={module._id} />;
      })}
    </div>
  );
}

// import { useFetchCourse, useFetchModulesForCourse } from "@/app/api/services/useFetchCourse";
// import CourseDetails from "@/components/CourseDetails";
// import CourseModule from "@/components/CourseModule";
// import React from "react";

// type courseModuleProps = {
//   _id: string;
//   course_id: string;
//   title: string;
//   difficulty: string;
//   resources: string[];
//   content_ids: string[];
//   no_question: number;
//   type: string;
//   question_bank: string[];
//   quizzes: string[];
//   timestamp: string;
//   __v: number;
//   ratings: number[];
// };

// export default function CoursePage({ params }: { params: { courseid: string } }) {
//   //@ts-expect-error
//   const { courseid } = React.use(params);
//   const { courseDetails } = useFetchCourse(courseid);
//   const modules = useFetchModulesForCourse(courseid);
//   console.log(modules);
//   return (
//     <div>
//       <CourseDetails courseData={courseDetails} />
//       {modules.map((module) => {
//         return <CourseModule module={module} key={module._id} />;
//       })}
//     </div>
//   );
// }

// import { useRouter } from 'next/navigation';
// import { useFetchCourse } from '../../api/services/useFetchCourse';
// import { useModuleService } from '@/app/api/services/useModuleService';
// import CourseDetails from '../../../components/CourseDetails';
// import ModuleDetails from '../../../components/ModuleDetails';
// import CreateModule from '../../../components/CreateModule';
// import React, { useState, useEffect } from 'react';
// import { useAuth } from "../../../components/AuthContext";

// export default function CoursePage({ params }: { params: Promise<{ courseid: string }> }) {
//     const router = useRouter();
//     const [courseId, setCourseId] = useState<string | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const { tokenDetails } = useAuth();

//     useEffect(() => {
//         params.then((unwrappedParams) => {
//             setCourseId(unwrappedParams.courseid);
//         });
//     }, [params]);

//     const { moduleData, error, createModule, deleteModule, addRating, addQuestion, removeQuestion, updateModule, findModuleById } = useModuleService(courseId || '');
//     const { courseData, errorM } = useFetchCourse(courseId || '');

//     const handleOpenModal = () => {
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//     };

//     if (error) return <div>Error: {error}</div>;
//     if (errorM) return <div>Error: {errorM}</div>;
//     if (!courseData || !courseId) return <div>Loading...</div>;
//     if (!moduleData) return <div>Loading...</div>;

//     //const courseIdFromData = moduleData._id;

//     return (
//         <div>
//             <CourseDetails courseData={courseData} onBack={() => router.push('/course')} />
//             {(!tokenDetails || (tokenDetails.role !== 'admin' && tokenDetails.role !== 'instructor')) && (
//                 <>
//                     <button onClick={handleOpenModal} className="addButton">+</button>
//                     {isModalOpen && (
//                         <CreateModule courseId={courseId} onClose={handleCloseModal} createModule={createModule} />
//                     )}
//                 </>
//             )}
//             <ModuleDetails
//                 moduleData={moduleData}
//                 addRating={addRating}
//                 addQuestion={addQuestion}
//                 removeQuestion={removeQuestion}
//                 updateModule={updateModule} onClose={handleCloseModal}
//             />
//         </div>
//     );
// }

"use client";

import { useRouter } from 'next/navigation';
import { useFetchCourse } from '../../api/services/useFetchCourse';
//import { useFetchModules } from '@/app/api/services/useFetchModules';
import { useModuleService } from '@/app/api/services/useModuleService';
import CourseDetails from '../../../components/CourseDetails';
import ModuleDetails from '../../../components/ModuleDetails';
import React from 'react';

export default function CoursePage({ params }: { params: { courseid: string } }) {
    const router = useRouter();
    // @ts-ignore
    const {courseid} = React.use(params);
    const { moduleData, error, createModule, deleteModule } = useModuleService(courseid);
    const { courseData, errorC } = useFetchCourse(courseid);
    //const { moduleData, errorM } = useFetchModules(courseid);

    if (error) return <div>Error: {error}</div>;

    if (errorC) return <div>Error: {errorC}</div>;
    if (!courseData) return <div>Loading...</div>;

    if (error) return <div>Error: {error}</div>;
    if (!moduleData) return <div>Loading...</div>;
    
    return (
      <div>
        <CourseDetails courseData={courseData} onBack={() => router.push('/course')} />
        <ModuleDetails moduleData={moduleData} />
      </div>
    );
    
}

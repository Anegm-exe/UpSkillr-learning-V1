'use client';
import { useFetchCourseProgress } from "@/app/api/services/useFetchProgress";
import { useAuth } from "@/components/AuthContext";
import ProgressDetails from "@/components/ProgrerssDetails";
import { useRouter } from "next/navigation";
import React from "react";


export default function ProgressPage({ params } : { params:{courseId:string}}) {
    const router = useRouter();
    //@ts-ignore
    const {courseId} = React.use(params);
    const { tokenDetails } = useAuth();
    const {progressData} = useFetchCourseProgress(courseId,tokenDetails?._id)
    return <ProgressDetails progressData={progressData} onBack={() => router.push('/progress')}/>;
}
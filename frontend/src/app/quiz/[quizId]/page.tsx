'use client';
import { useFetchQuiz } from "@/app/api/services/useFetchQuiz";
import QuizForm from "@/components/QuizForm";
import { useRouter } from "next/navigation";
import React from "react";

export default function QuizPage({ params } : { params:{quizId:string}}) {
    const router = useRouter();
    //@ts-ignore
    const {quizId} = React.use(params);
    const { quizData } = useFetchQuiz(quizId)
    if(!quizData)
        return <div>Loading...</div>
    console.log(quizData);
    return <QuizForm quizData={quizData} goBack={()=>router.push('/')} goToModule={() => router.push(`/course/${quizData.module_id.course_id}`)}/>
}
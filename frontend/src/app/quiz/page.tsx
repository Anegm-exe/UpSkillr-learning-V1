'use client';
import { useAuth } from "@/components/AuthContext";
import { useFetchRetakeQuiz, useFetchUserQuizzes } from "../api/services/useFetchQuiz";
import QuizDetails from "@/components/QuizDetails";
import { useRouter } from "next/navigation";
import quizcss from '@/styles/quizcss.module.css';
import { useState } from "react";
import axios from "../api/axios";

export default function QuizPage() {
    const route = useRouter();
    const { tokenDetails } = useAuth();
    const { quizzesData } = useFetchUserQuizzes(tokenDetails?._id);

    // State for managing the current quiz being retaken
    const [isRetaking, setIsRetaking] = useState<boolean>(false);

    // Function to handle the retake action
    const handleRetakeQuiz = async (quizId: string) => {
        setIsRetaking(true);
        try {
            // Directly fetch the quiz data using axios
            const response = await axios.post(`/course/retakequiz/${quizId}`);
            const quiz_id = response.data;
            
            if (quiz_id) {
                route.push(`/quiz/${quiz_id}`);
            }
        } catch (error) {
            console.error("Error retaking quiz:", error);
        } finally {
            setIsRetaking(false);
        }
    };

    return (
        <div className={quizcss.quizContainer}>
            <h1>Quiz Details</h1>
            {quizzesData.map((quiz, index) => (
                <QuizDetails
                    quizData={quiz}
                    key={index}
                    onMoreDetails={() => route.push(`/quiz/${quiz._id}`)}
                    onRetake={() => handleRetakeQuiz(quiz._id || "")}
                />
            ))}
        </div>
    );
}
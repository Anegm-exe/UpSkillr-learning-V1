'use client';
import { useAuth } from "@/components/AuthContext";
import { useFetchRetakeQuiz, useFetchUserQuizzes } from "../api/services/useFetchQuiz";
import QuizDetails from "@/components/QuizDetails";
import { useRouter } from "next/navigation";
import quizcss from '@/styles/quizcss.module.css';
import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function QuizPage() {
    const route = useRouter();
    const { tokenDetails } = useAuth();

    if(tokenDetails?.role === 'student') {
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
                <h1 className={quizcss.pageTitlePage}>Quiz Details</h1>
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
    } else if(tokenDetails?.role === 'instructor') {

        const [moduleAverages, setModuleAverages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchModuleAverages = async () => {
            try {
                const response = await axios.get('/course/instructorQuiz');
                setModuleAverages(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching module averages:", error);
                setIsLoading(false);
            }
        };

        if (tokenDetails?.role === 'instructor') {
            fetchModuleAverages();
        }
    }, [tokenDetails]);
        return (
            <div className={quizcss.quizContainer}>
                <h1 className={quizcss.pageTitlePage}>Course Quiz Analytics</h1>
                {isLoading ? (
                    <div className={quizcss.quizDetails}>
                        <p className={quizcss.quizInfo}>Loading analytics...</p>
                    </div>
                ) : (
                    moduleAverages.map((course, index) => (
                        <div key={index} className={quizcss.quizDetails}>
                            <h2 className={quizcss.quizTitle}>{course.courseName}</h2>
                            <div className={quizcss.moduleGrid}>
                                {course.moduleAverage.map((module, moduleIndex) => (
                                    <div key={moduleIndex} className={quizcss.moduleCard}>
                                        <h3 className={quizcss.moduleTitle}>
                                            {module.moduleTitle}
                                        </h3>
                                        <div className={quizcss.scoreSection}>
                                            <p className={quizcss.quizInfo}>
                                                Average Score: {Math.round(module.averageScore)}%
                                            </p>
                                            <div className={quizcss.scoreBar}>
                                                <div 
                                                    className={quizcss.scoreProgress}
                                                    style={{ 
                                                        width: `${module.averageScore}%`,
                                                        backgroundColor: module.averageScore >= 50 ? '#48bb78' : '#f56565'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        )
    }else {
        return <h1>Not Authorized</h1>
    }
}
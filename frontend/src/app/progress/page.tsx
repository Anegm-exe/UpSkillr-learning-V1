'use client';

import { useFetchUserProgresses } from "@/app/api/services/useFetchProgress";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import progresscss from '../../styles/progresscss.module.css';
import ProgressDetails from "@/components/ProgrerssDetails";

export default function ProgressPage() {
  const router = useRouter();
  const { tokenDetails } = useAuth();
  const { progressesData } = useFetchUserProgresses(tokenDetails?._id);
  return (
    <div className={progresscss.progressPageContainer}>
      <h1 className={progresscss.pageTitle}>Your Progress</h1>
      <div className={progresscss.progressListContainer}>
        {progressesData && progressesData.length > 0 ? (
          progressesData.map((progress: {
            _id?: string,
            user_id: {_id:string,name:string},
            course_id: {_id:string ,title:string},
            completion_percentage: number,
            last_accessed: Date,
            completed_modules: { module_id: string; score: number }[],
            average_quiz?: number,
            opened_times: number
          }) => (
            <ProgressDetails
              key={progress._id}
              progressData={progress}
              onMoreDetails={() => router.push(`/progress/${progress.course_id._id}`)}
            />
          ))
        ) : (
          <h2 className={progresscss.noProgressMessage}>No progress found</h2>
        )}
      </div>
    </div>
  );
}

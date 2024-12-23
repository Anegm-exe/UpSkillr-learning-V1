'use client';
import { useFetchForum } from "@/app/api/services/useFetchForum";
import { useFetchCourseProgress } from "@/app/api/services/useFetchProgress";
import { useAuth } from "@/components/AuthContext";
import ForumDetails from "@/components/FroumDetails";
import ProgressDetails from "@/components/ProgrerssDetails";
import { useRouter } from "next/navigation";
import React from "react";


export default function ForumPage({ params } : { params:{forumid:string}}) {
    const router = useRouter();
    //@ts-ignore
    const {forumid} = React.use(params);
    const { tokenDetails } = useAuth();
    //@ts-expect-error
    const {forumData,refetch} = useFetchForum(forumid,tokenDetails?._id)

      // Function to handle refreshing chat data after sending a message
    const handleRefreshForum = () => {
        refetch(); // Trigger the refetching of chat data to get updated messages
    };

    return <ForumDetails forumData={forumData} onBack={forumData} onNewMessageSent={handleRefreshForum} onDelete={() => router.push('/forum')}/>;
}
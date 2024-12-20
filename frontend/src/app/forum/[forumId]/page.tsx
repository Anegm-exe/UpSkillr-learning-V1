'use client';
import axios from '../../api/axios';
import React, { use } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { useEffect } from 'react';
import { useFetchForum } from '../../api/services/useFetchForum';
import { useFetchMessage } from '../../api/services/useFetchMessage';
import ForumDetails from '@/components/ForumDetails';


export const getMessages = async (messageId: string): Promise<string> => {
    const message = await axios.get(`/messages/${messageId}`);
    return message.data.text;
}


export default function Forum({ params }: { params: { forumId: string } }) {
    // @ts-ignore
    const { forumId } = React.use(params);
    // const [messages, setMessages] = useState<string[]>([]);
    // const [messageText, setMessageText] = useState<string>("");
    const router = useRouter();
    const { tokenDetails, isLoading } = useAuth();

    const { forumData, error } = useFetchForum(forumId);

    // const { messageData } = useFetchMessage(forumData.messages);
    
    useEffect(() => {
        if (isLoading) return;
        if (!tokenDetails) {
            router.push("/login");
            return;
        }
    }, [tokenDetails, isLoading]);

    if (error) return <div>Error: {error}</div>;
    if (!forumData) return <div>Loading...</div>;
    console.log('ForumDetails forumData:', forumData);

    const displayMessages = async () => {
        const { messageData } = useFetchMessage(forumData.messages);
        if (!forumData.messages) return <p>No messages</p>;
        return <p>{messageData.text}</p>;
    }
    return (
        <div>
            <h1>{forumData.title}</h1>

            <ForumDetails forumData={forumData} onBack={() => router.push('/forum')} />



        </div>
    );

}
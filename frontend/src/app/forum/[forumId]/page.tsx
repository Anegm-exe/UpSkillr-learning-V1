'use client';
import axios from '../../api/axios';
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { useEffect } from 'react';
import { useFetchForum } from '../../api/services/useFetchForum';


export const getMessages = async (messageId: string): Promise<string> => {
    const message = await axios.get(`/messages/${messageId}`);
    return message.data.text;
}


export default function Forum({ params }: { params: { forumId: string } }) {
    // @ts-ignore
    const { forumId } = React.use(params);
    // const [messages, setMessages] = useState<string[]>([]);
    const [messageText, setMessageText] = useState<string>("");
    const router = useRouter();
    const { tokenDetails, isLoading } = useAuth();

    const { forumData, error } = useFetchForum(forumId);
    console.log(1);
    useEffect(() => {
        if (isLoading) return;
        if (!tokenDetails) {
            router.push("/login");
            return;
        }
    }, [tokenDetails, isLoading]);

    if (error) return <div>Error: {error}</div>;
    if (!forumData) return <div>Loading...</div>;
    console.log(2);

    const sendMessage = async () => {
        const newMessage = await axios.post(`/messages`, { text: messageText });
        const newMessageId = newMessage.data.id;
        const messages = forumData.data.messages;
        messages.data.push(newMessageId);
        setMessages([...messages, messageText]);
        await axios.put(`/forums/${forumId}`, { newMessageId });
        setMessageText("");
    };
    console.log(3);
    const displayMessages = async () => {
        const forum = await axios.get(`/forums/${forumId}`);
        const messages = forum.data.messages;
        return messages.data.text
    }
    console.log(4);
    return (
        <div>
           <h1>{forumData.title}</h1> 
            {/* <h1>Forum {forumId}</h1>
            <div>
                {displayMessages()}
            </div>

            <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
            <button onClick={sendMessage}>Send</button> */}
        </div>
    );

}
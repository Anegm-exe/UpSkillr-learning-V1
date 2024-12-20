import axios from '../../../../api/axios';
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { useEffect } from 'react';

export const getMessagesIds = async (forumId: string): Promise<string[]> => {
    const forum = await axios.get(`/forums/${forumId}`);
    const messages = forum.data.messages;
    return messages.data;
}
export const getMessages = async (messageId: string): Promise<string> => {
    const message = await axios.get(`/messages/${messageId}`);
    return message.data.text;
}

export default function Forum({ params }: { params: { forumId: string } }) {
    // @ts-ignore
    const { forumId } = React.use(params);
    const [messages, setMessages] = useState<string[]>([]);
    const [messageText, setMessageText] = useState<string>("");
    const router = useRouter();
    const { tokenDetails, isLoading } = useAuth();

    const { forumData, error } = useFetchForum(forumId);
    
        if (error) return <div>Error: {error}</div>;
        if (!forumData) return <div>Loading...</div>;

    useEffect(() => {
        if (isLoading) return;
        if (!tokenDetails) {
            router.push("/login");
            return;
        }
        getMessagesIds(forumId).then((messageIds) => {
            const messagePromises = messageIds.map((messageId) => getMessages(messageId));
            Promise.all(messagePromises).then((messages) => {
                setMessages(messages);
            });
        });
    }, [tokenDetails, isLoading]);
    
    const sendMessage = async () => {
        
    };
    return (
        <div>
            <h1>Forum {forumId}</h1>
            {messages.map((message) => <p>{message}</p>)}
            <input type="text" value={messageText} onChange={(e) => setMessageText(e.target.value)} />
            <button onClick={sendMessage}>Send</button>
        </div>
    );

}
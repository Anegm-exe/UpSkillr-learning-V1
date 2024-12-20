import React from "react";

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "../../api/axios";
import "../../../styles/globals.css";
import { useAuth } from "@/components/AuthContext";

export default function messageCard(props) {
    const router = useRouter();
    const { tokenDetails } = useAuth();
    
    if (isLoading) {
        return <div className={styles.container}>Loading...</div>;
    }
    const user = tokenDetails;
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');

    useEffect(() => {
        if (forumId) {
            const loadMessages = async () => {
                const data = await fetchMessages(Number(forumId));
                setMessages(data);
            };
            loadMessages();
        }
    }, [forumId]);

    const handleSendMessage = async () => {
        if (forumId && content) {
            const message = await postMessage(Number(forumId), content, 1); // Hardcoded userId
            setMessages([...messages, message]);
            setContent('');
        }
    };

    
    return <div>
       <p> Text = {props.text}</p>
       <p> Poster = {props.poster}</p>

        </div>;
}

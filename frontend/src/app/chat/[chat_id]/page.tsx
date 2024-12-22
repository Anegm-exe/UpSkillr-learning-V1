'use client';
import React from "react";
import ChatDetails from "@/components/ChatDetails";
import { useFetchChat } from "@/app/api/services/useFetchChat";
import { useRouter } from "next/navigation";
export default function chatPage({params}: {params: {chat_id:string}}) {
    const router = useRouter();
    //@ts-ignore
    const {chat_id}= React.use(params); 
    const {chatData} = useFetchChat(chat_id);
    return <ChatDetails chatData={chatData} onBack={() => router.push('/chat')} />
}; 

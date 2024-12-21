import React from "react";
import ChatDetails from "../ChatDetails";
const chatPage= ({params}: {params: {chat_id:string}}) =>{
    const {chat_id}= params; 
    return <ChatDetails chatId={chat_id} />
}; 
export default chatPage;
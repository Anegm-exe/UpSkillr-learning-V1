import React from "react";
import axios from "axios";
import ChatForm from "./ChatForm";
const Chat = ({ chatId }: { chatId: string }) => {
    return (
      <div>
        <h1>Chat</h1>
        <p>Chat ID: {chatId}</p>
        <ChatForm />
      </div>
    );
  };
  
  export default Chat;
  
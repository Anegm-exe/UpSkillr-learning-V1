import React, { useState, useRef, useEffect } from "react";
import chatcss from "@/styles/chatcss.module.css";
import axios from "@/app/api/axios";

interface Message {
  _id: string;
  user_id: {
    _id: string;
    name: string;
    profile_picture_url: string;
  };
  repliedTo_id?: Message;
  text: string;
  timestamp: Date;
}

interface ChatDetailsProps {
  chatData: {
    _id: string;
    admin_id: string;
    name: string;
    user_ids: string[];
    messages: Message[];
  };
  onBack: () => void;
  onNewMessageSent: () => void; // Add onNewMessageSent prop
}

export default function ChatDetails({ chatData, onNewMessageSent }: ChatDetailsProps) {
  const [messageText, setMessageText] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null); // State for replying to a specific message
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom when a new message is sent or when the component is mounted
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Send message handler
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      const payload = {
        message: messageText,
      };
      if(replyingTo) {
        await axios.post(`chat/${chatData._id}/reply/${replyingTo._id}`, payload);
      }else 
      {
        await axios.post(`chat/${chatData._id}/send`, payload);
      }
      onNewMessageSent();
    } catch {
      console.error("Error sending message");
    }
    setMessageText("");
    setReplyingTo(null); // Clear reply context
  };

  // Handle Enter key press to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Scroll to bottom on mount or when chatData changes
  useEffect(() => {    
    // Set up polling interval
    const interval = setInterval(() => {
      onNewMessageSent(); // This will trigger the chat refresh
    }, 3000); // 3000 milliseconds = 3 seconds
    
    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array since we want this to run only once on mount

  useEffect(() => {
    scrollToBottom();
  }, [chatData.messages]); // This will trigger whenever messages update

  if (!chatData) return <h2>Loading...</h2>;

  return (
    <div className={chatcss.chatDetailsContainer}>
      {/* Chat Header */}
      <div className={chatcss.chatHeader}>
        <img
          src={
            "https://lh3.googleusercontent.com/ABlX4ekWIQimPjZ1HlsMLYXibPo2xiWnZ2iny1clXQm2IQTcU2RG0-4S1srWsBQmGAo"
          }
          className={chatcss.profilePicture}
        />
        <h1 className={chatcss.chatTitle}>{chatData.name}</h1>
      </div>

      {/* Messages Section */}
      <div className={chatcss.messagesContainer}>
        {chatData.messages.length > 0 ? (
          chatData.messages.map((message) => (
            <div
              key={message._id}
              className={chatcss.messageItem}
              onDoubleClick={() => setReplyingTo(message)} // Set the reply context on double-click
            >
              <img
                src={message.user_id.profile_picture_url}
                alt={message.user_id.name}
                className={chatcss.profilePicture}
              />
              <div className={chatcss.messageContent}>
                <div className={chatcss.userName}>{message.user_id.name}</div>
                <div className={chatcss.messageText}>{message.text}</div>
                <div className={chatcss.timestamp}>
                  {new Date(message.timestamp).toLocaleString()}
                </div>
                {message.repliedTo_id && (
                  <div className={chatcss.replySection}>
                    <strong>
                      Replying to {message.repliedTo_id.user_id.name}:
                    </strong>{" "}
                    <span>{message.repliedTo_id.text}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
        <div ref={messageEndRef} /> {/* Empty div to serve as a scroll target */}
      </div>

      {/* Send Message Section */}
      <div className={chatcss.sendMessageContainer}>
        {replyingTo && ( // Show reply context if replying to a message
          <div className={chatcss.replyContext}>
            <strong>Replying to {replyingTo.user_id.name}:</strong>{" "}
            <span>{replyingTo.text}</span>
            <button
              onClick={() => setReplyingTo(null)}
              className={chatcss.cancelReplyButton}
            >
              Cancel
            </button>
          </div>
        )}
        <input
          type="text"
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown} // Handle Enter key press
          className={chatcss.messageInput}
        />
        <button onClick={handleSendMessage} className={chatcss.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}

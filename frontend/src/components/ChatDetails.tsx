import React, { useState, useRef, useEffect } from "react";
import chatcss from "@/styles/chatcss.module.css";
import axios from "@/app/api/axios";
import { useAuth } from "./AuthContext";

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
  onMessage: () => void; // Add onNewMessageSent prop
  onChatDetails: () => void;
  onReplyClick?: (messageId: string) => void; // Add this property
  replyToMessageId?: string | null; // Add this property
  onLeaveSuccess: () => void; // Add this property
}

export default function ChatDetails({ chatData, onNewMessageSent }: ChatDetailsProps) {
  const { tokenDetails } = useAuth();
  const [messageText, setMessageText] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null); // State for replying to a specific message
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);


// Add these at the beginning of your component
const [isAtBottom, setIsAtBottom] = useState(true);
const messagesContainerRef = useRef<HTMLDivElement | null>(null);

// Add this function to check if scrolled to bottom
const isScrolledToBottom = () => {
  const container = messagesContainerRef.current;
  if (!container) return true;
  
  const threshold = 100; // pixels from bottom to consider "at bottom"
  return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
};

// Modify the scrollToBottom function
const scrollToBottom = () => {
  if (isAtBottom) {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
};

// Add scroll event listener
useEffect(() => {
  const container = messagesContainerRef.current;
  if (!container) return;

  const handleScroll = () => {
    setIsAtBottom(isScrolledToBottom());
  };

  container.addEventListener('scroll', handleScroll);
  return () => container.removeEventListener('scroll', handleScroll);
}, []);

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
      onMessage();
    } catch {
      console.error("Error sending message");
    }
    setMessageText("");
    setReplyingTo(null); // Clear reply context
  };


  const handleDeleteMessage = async (messageId: string) => {
    try {
      await axios.delete(`chat/${chatData._id}/message/${messageId}`);
      onNewMessageSent();
      setSelectedMessage(null);
    } catch (error){
      //@ts-expect-error
      console.error("Error deleting message: " + error.response.data.message);
    }
  };
  
  // Add this function to handle message editing
  const [editingText, setEditingText] = useState("");
  const handleEditMessage = async (messageId: string) => {
    try {
      await axios.patch(`message/${messageId}`, {
        text: editingText
      });
      onNewMessageSent();
      setSelectedMessage(null);
      setEditingText("");
    } catch {
      console.error("Error editing message");
    }
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
    if (chatData.messages.length > 0) {
      // If it's the initial load or user is at bottom, scroll down
      if (!messagesContainerRef.current?.scrollTop || isAtBottom) {
        scrollToBottom();
      }
    }
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
      <div 
      className={chatcss.messagesContainer}
      ref={messagesContainerRef}>
      {chatData.messages.length > 0 ? (
        chatData.messages.map((message) => (
          <div
            key={message._id}
            className={chatcss.messageItem}
            onDoubleClick={() => setSelectedMessage(message)}
          >
            <img
              src={message.user_id.profile_picture_url}
              alt={message.user_id.name}
              className={chatcss.profilePicture}
            />
            <div className={chatcss.messageContent}>
              <div className={chatcss.userName}>{message.user_id._id === tokenDetails?._id? 'You' : message.user_id.name}</div>
              <div className={chatcss.messageText}>{message.text}</div>
              <div className={chatcss.timestamp}>
                {new Date(message.timestamp).toLocaleString()}
              </div>
              {message.repliedTo_id && (
                <div className={chatcss.replySection}>
                  <strong>Replying to {message.repliedTo_id.user_id.name}:</strong>{" "}
                  <span>{message.repliedTo_id.text}</span>
                </div>
              )}
              
              {/* Message Actions Menu */}
              {selectedMessage?._id === message._id && (
                <div className={chatcss.messageActions}>
                  <button
                    className={chatcss.actionButton}
                    onClick={() => {
                      setReplyingTo(message);
                      setSelectedMessage(null);
                    }}
                  >
                    Reply
                  </button>
                  {tokenDetails?._id === selectedMessage.user_id._id && 
                  <button
                    className={chatcss.actionButton}
                    onClick={() => {
                      setEditingText(message.text);
                      setSelectedMessage(message);
                    }}
                  >
                    Edit 
                  </button>
                  }
                  {(tokenDetails?._id === selectedMessage.user_id._id || tokenDetails?._id === chatData.admin_id) && 
                  <button
                    className={chatcss.actionButton}
                    onClick={() => handleDeleteMessage(message._id)}
                  >
                    Delete
                  </button>}
                  <button
                    className={chatcss.actionButton}
                    onClick={() => setSelectedMessage(null)}
                  >
                    Cancel
                  </button>
                </div>
              )}
              
              {/* Editing Interface */}
              {selectedMessage?._id === message._id && editingText !== "" && (
                <div className={chatcss.editInterface}>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className={chatcss.editInput}
                  />
                  <button
                    className={chatcss.saveButton}
                    onClick={() => handleEditMessage(message._id)}
                  >
                    Save
                  </button>
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

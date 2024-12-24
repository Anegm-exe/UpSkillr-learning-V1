/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from "react";
import forumcss from "@/styles/forumcss.module.css";
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

interface ForumDetailsProps {
  forumData: {
    _id: string;
    course_id: string;
    user_id:  {
        _id: string;
        name: string;
        profile_picture_url: string;
    };
    title: string;
    messages: Message[];
    timestamp: Date;
  };
  onBack: () => void;
  onNewMessageSent: () => void;
  onDelete: () => void;
}

export default function ForumDetails({ forumData, onNewMessageSent,onDelete }: ForumDetailsProps) {
  const { tokenDetails } = useAuth();
  const [messageText, setMessageText] = useState("");
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editTitle, setEditTitle] = useState(""); // State for editing title
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode


  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    try {
      const payload = {
        message: messageText,
      };
      if (replyingTo) {
        await axios.post(`forum/${forumData._id}/reply/${replyingTo._id}`, payload);
      } else {
        await axios.post(`forum/${forumData._id}/send`, payload);
      }
      onNewMessageSent();
    } catch {
      console.error("Error sending message");
    }
    setMessageText("");
    setReplyingTo(null);
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await axios.delete(`forum/${forumData._id}/message/${messageId}`);
      onNewMessageSent();
      setSelectedMessage(null);
    } catch (error) {
      //@ts-expect-error
      console.error("Error deleting message: " + error.response.data.message);
    }
  };

  const handleEditMessage = async (messageId: string) => {
    try {
      await axios.patch(`/message/${messageId}`, {
        text: editingText
      });
      onNewMessageSent();
      setSelectedMessage(null);
      setEditingText("");
    } catch {
      console.error("Error editing message");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleEditForum = async (forumId:string) => {
    try {
      await axios.patch(`forum/${forumId}`, { title: editTitle });
      setEditTitle(""); // Clear the editTitle state
      setIsEditing(false); // Exit edit mode
      console.log(`Edit forum with ID: ${forumId}`);
      // Optionally: Refresh the forum data
    } catch (error) {
      console.error("Failed to edit the forum:", error);
    }
  };
  
  const handleDeleteForum = (forumId:string) => {
    if (confirm("Are you sure you want to delete this forum?")) {
      try{
        axios.delete(`/forum/${forumId}`);
        onDelete();
        console.log(`Delete forum with ID: ${forumId}`);
      }catch{
      }
    }
  };
  

  useEffect(() => {    
    const interval = setInterval(() => {
      onNewMessageSent();
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  if (!forumData) return <h2>Loading...</h2>;
  return (
    <div className={forumcss.forumDetailsContainer}>
      <div className={forumcss.forumHeader}>
        <img
          src={forumData.user_id.profile_picture_url}
          alt={forumData.user_id.name}
          className={forumcss.profilePicture}
        />
        <div className={forumcss.userInfoContainer}>
          <div className={forumcss.userName}>{forumData.user_id.name}</div>
          <div className={forumcss.forumInfo}>
            Posted on: {new Date(forumData.timestamp).toLocaleDateString()}
          </div>
        </div>
              {(tokenDetails?._id === forumData.user_id._id || tokenDetails?.role === "instructor") && (
          <div className={forumcss.actionButtons}>
            {!isEditing ? (
              <button
                className={forumcss.editButton}
                onClick={() => {
                  setIsEditing(true); // Enter edit mode
                  setEditTitle(forumData.title); // Set initial title value
                }}
              >
                Edit
              </button>
            ) : (
              <button
                className={forumcss.saveButton}
                onClick={() => handleEditForum(forumData._id)}
              >
                Save
              </button>
            )}
            <button
              className={forumcss.deleteButton}
              onClick={() => handleDeleteForum(forumData._id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {!isEditing ? (
        <h1 className={forumcss.forumTitle}>{forumData.title}</h1>
      ) : (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className={forumcss.editTitleInput}
        />
      )}


      <div className={forumcss.messagesContainer} ref={messagesContainerRef}>
        {forumData.messages.length > 0 ? (
          forumData.messages.map((message) => (
            <div
              key={message._id}
              className={forumcss.messageItem}
              onDoubleClick={() => setSelectedMessage(message)}
            >
              <img
                src={message.user_id.profile_picture_url}
                alt={message.user_id.name}
                className={forumcss.profilePicture}
              />
              <div className={forumcss.messageContent}>
                <div className={forumcss.userName}>
                  {message.user_id._id === tokenDetails?._id ? 'You' : message.user_id.name}
                </div>
                <div className={forumcss.messageText}>{message.text}</div>
                <div className={forumcss.timestamp}>
                  {new Date(message.timestamp).toLocaleString()}
                </div>
                {message.repliedTo_id && (
                  <div className={forumcss.replySection}>
                    <strong>
                      Replying to {message.repliedTo_id.user_id._id === tokenDetails?._id ? 'you' : message.repliedTo_id.user_id.name}:
                    </strong>{" "}
                    <span>{message.repliedTo_id.text}</span>
                  </div>
                )}

                {selectedMessage?._id === message._id && (
                  <div className={forumcss.messageActions}>
                    <button
                      className={forumcss.actionButton}
                      onClick={() => {
                        setReplyingTo(message);
                        setSelectedMessage(null);
                      }}
                    >
                      Reply
                    </button>
                    {tokenDetails?._id === selectedMessage.user_id._id && (
                      <button
                        className={forumcss.actionButton}
                        onClick={() => {
                          setEditingText(message.text);
                          setSelectedMessage(message);
                        }}
                      >
                        Edit
                      </button>
                    )}
                    {(tokenDetails?._id === selectedMessage.user_id._id || tokenDetails?._id === forumData.user_id) && (
                      <button
                        className={forumcss.actionButton}
                        onClick={() => handleDeleteMessage(message._id)}
                      >
                        Delete
                      </button>
                    )}
                    <button
                      className={forumcss.actionButton}
                      onClick={() => setSelectedMessage(null)}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {selectedMessage?._id === message._id && editingText !== "" && (
                  <div className={forumcss.editInterface}>
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className={forumcss.editInput}
                    />
                    <button
                      className={forumcss.saveButton}
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
          <p>No responses yet. Be the first to respond!</p>
        )}
        <div ref={messageEndRef} />
      </div>

      <div className={forumcss.sendMessageContainer}>
        {replyingTo && (
          <div className={forumcss.replyContext}>
            <strong>
              Replying to {replyingTo.user_id._id === tokenDetails?._id ? 'your message' : replyingTo.user_id.name}:
            </strong>{" "}
            <span>{replyingTo.text}</span>
            <button
              onClick={() => setReplyingTo(null)}
              className={forumcss.cancelReplyButton}
            >
              Cancel
            </button>
          </div>
        )}
        <input
          type="text"
          placeholder="Write your response..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          className={forumcss.messageInput}
        />
        <button onClick={handleSendMessage} className={forumcss.sendButton}>
          Post Response
        </button>
      </div>
    </div>
  );
}
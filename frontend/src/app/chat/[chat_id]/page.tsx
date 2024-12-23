'use client';
<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFetchChat } from "@/app/api/services/useFetchChat"; 
import axios from '../../api/axios';
import ChatDetails from "../../../components/ChatDetails";
import LeaveChat from "../LeaveChat";
import MessageSend from "./MessageSend";
import ReplyMessage from "./MessageReply";
export default function ChatPage({ params }: { params: Promise<{ chat_id: string }> }) {
  const { chat_id } = React.use(params);
  const { chatData, refetch } = useFetchChat(chat_id);
  const [replyToMessageId, setReplyToMessageId] = useState<string | null>(null); 
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [chatResults, setChatResults] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(false); 
  const [error, setError] = useState<string>('');
  const [showCreateChat, setShowCreateChat] = useState(false);


  const router = useRouter();
      
  // to handle new message sent
  const handleNewMessageSent = async () => {
    try {
      await refetch(chatData); // refetch chat data after a new message is sent
    } catch (error) {
      console.error("Error refetching chat data:", error);
    }
  };

  // to handle reply to a message
  const handleReplyClick = (messageId: string) => {
    setReplyToMessageId(messageId); // Set the reply context
  };

  // to handle leaving the chat
  const handleLeaveSuccess = () => {
    alert("You have successfully left the chat!");
    router.push("/chat"); // redirect user to the chat list page
  };

  // search query change
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  //fetch chats by name when search query changes
  useEffect(() => {
    const fetchChats = async () => {
      if (!searchQuery) {
        setChatResults([]); // Clear results if search query is empty
        return;
      }

      setLoading(true);
      setError(''); 

      try {
        const response = await axios.get(`/chat/search`, {
          params: { name: searchQuery },
        });

        if (response.status === 200) {
          setChatResults(response.data); 
        } else {
          throw new Error('No chats found');
        }
      } catch (err: any) {
        setError('An error occurred while searching: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false); 
      }
    };

    fetchChats();
  }, [searchQuery]); 
  const handleToggleCreateChat = () => {
    setShowCreateChat(!showCreateChat);
    if (!chatData) return <h2>Loading chat...</h2>;

    return (
      <div>

      {/* Render the ChatDetails component if chatData is available */}
      {chatData && (
        <ChatDetails
          chatData={chatData}
          onMessage={handleNewMessageSent}
          onReplyClick={handleReplyClick}
          replyToMessageId={replyToMessageId}
          onLeaveSuccess={handleLeaveSuccess}
          onBack={() => {
            // Implement the onBack functionality
            router.push('/chat');
          }}
          onChatDetails={() => {
            // Implement additional functionality here if needed
          }}
        />
      )}

      {/* Render the LeaveChat component if chat_id is available */}
      {chat_id && (
        <LeaveChat
          chatId={chat_id}
          onLeaveSuccess={handleLeaveSuccess}
        />
      )}
    </div>
  );
  }
  return (
    <div>

   

      {/* Render the ChatDetails component if chatData is available */}
      {chatData && (
        <ChatDetails
          chatData={chatData}
          onMessage={handleNewMessageSent}
          onReplyClick={handleReplyClick}
          replyToMessageId={replyToMessageId}
          onLeaveSuccess={handleLeaveSuccess}
          onBack={() => {
            // Implement the onBack functionality
            router.push('/chats');
          }}
          onChatDetails={() => {
            // Implement additional functionality here if needed
          }}
        />
      )}

      {/* Render the LeaveChat component if chat_id is available */}
      {chat_id && (
        <LeaveChat
          chatId={chat_id}
          onLeaveSuccess={handleLeaveSuccess}
        />
      )}
    </div>
  );
  
=======
import React, { useState } from "react";
import { useFetchChat } from "@/app/api/services/useFetchChat";
import { useRouter } from "next/navigation";
import chatdetailcss from "@/styles/chatdetailcss.module.css";
import axios from "@/app/api/axios";
import { useAuth } from "@/components/AuthContext";

export default function ChatPage({ params }: { params: { chat_id: string } }) {
  const router = useRouter();
  //@ts-expect-error
  const { chat_id } = React.use(params);
  const {tokenDetails} = useAuth();
  
  // Fetch chat data
  const { chatData } = useFetchChat(chat_id);

  const [isAddingUser, setIsAddingUser] = useState(false); // State to manage adding user
  const [email, setEmail] = useState(''); // State to store the email input

  if (!chatData) {
    return <p>Loading chat data...</p>;
  }

  // Function to toggle the email input field visibility
  const handleAddUserClick = () => {
    setIsAddingUser(!isAddingUser);
  };

  // Function to handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Function to handle adding user (you can implement the logic to add the user here)
  const handleAddUser = () => {
    // Logic to add user goes here, e.g., sending the email to your API.
    axios.post(`/chat/${chatData._id}/user/${email}`)
    setEmail(''); // Clear email input after submitting
    setIsAddingUser(false); // Hide the input field after adding the user
  };

  return (
    <div className={chatdetailcss.chatDetailsContainer}>
      {/* Chat Header */}
      <div className={chatdetailcss.chatHeader}>
        <h1>{chatData.name}</h1>
        <div className={chatdetailcss.chatHeaderActions}>
          <button onClick={() => router.push('/chat')}>Back to chat</button>
        </div>
      </div>

      {/* Chat Details Section */}
      <div className={chatdetailcss.chatDetails}>
        <h2>Chat Information</h2>
        <p><strong>Users:</strong></p>
        <ul>
          {chatData.user_ids.map((user, index) => (
            <li key={index}>
              <img
                src={user.profile_picture_url}
                alt={user.name}
                className={chatdetailcss.userProfilePicture} // Optional: add a class to style the image
                style={{ width: "30px", height: "30px", borderRadius: "50%" }} // Inline styling for the image (optional)
              />
              {user.name}{user._id === chatData.admin_id ? ' (Admin)' : ''}
            </li>
          ))}
        </ul>

        {/* Add User Button */}
        {tokenDetails?._id === chatData.admin_id && <button onClick={handleAddUserClick} className={chatdetailcss.addUserButton}>
          Add User
        </button>}

        {/* Show email input field if isAddingUser is true */}
        {isAddingUser && (
          <div className={chatdetailcss.addUserInputContainer}>
            <input
              type="email"
              placeholder="Enter user's email"
              value={email}
              onChange={handleEmailChange}
              className={chatdetailcss.emailInput}
            />
            <button onClick={handleAddUser} className={chatdetailcss.addButton}>
              Add
            </button>
          </div>
        )}
      </div>

      {/* Add additional sections here (e.g., settings, permissions, etc.) */}
    </div>
  );
>>>>>>> 7bdeee6de11f778df683293e6d6fa522206cab62
}

'use client';
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
}

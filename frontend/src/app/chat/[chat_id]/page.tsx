'use client';
import React, { useState } from "react";
import { useFetchChat } from "@/app/api/services/useFetchChat";
import { useRouter } from "next/navigation";
import chatinfocss from '@/styles/chatinfocss.module.css';
import axios from "@/app/api/axios";
import { useAuth } from "@/components/AuthContext";

export default function ChatPage({ params }: { params: { chat_id: string } }) {
  const router = useRouter();
  //@ts-expect-error
  const { chat_id } = React.use(params);
  const { tokenDetails } = useAuth();
  
  const { chatData } = useFetchChat(chat_id);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!chatData) {
    return (
      <div className={chatinfocss.loadingContainer}>
        Loading chat details...
      </div>
    );
  }

  const handleAddUserClick = () => {
    setIsAddingUser(!isAddingUser);
    if (!isAddingUser) {
      setEmail('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleAddUser = async () => {
    if (!email) return;

    try {
      setIsSubmitting(true);
      await axios.post(`/chat/${chatData._id}/user/${email}`);
      setEmail('');
      setIsAddingUser(false);
      // Optionally refresh chat data here
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleAddUser();
    }
  };

  return (
    <div className={chatinfocss.chatDetailsContainer}>
      <div className={chatinfocss.chatHeader}>
        <h1>{chatData.name}</h1>
        <button 
          onClick={() => router.push('/chat')}
          className={chatinfocss.backButton}
        >
          Back to Chats
        </button>
      </div>

      <div className={chatinfocss.chatDetails}>
        <h2>Participants</h2>
        <ul className={chatinfocss.usersList}>
          {chatData.user_ids.map((user) => (
            <li key={user._id} className={chatinfocss.userItem}>
              <img
                src={user.profile_picture_url || '/default-avatar.png'}
                alt={user.name}
                className={chatinfocss.userProfilePicture}
              />
              <span className={chatinfocss.userName}>
                {user.name}
                {user._id === chatData.admin_id && (
                  <span className={chatinfocss.adminBadge}>Admin</span>
                )}
              </span>
            </li>
          ))}
        </ul>

        {tokenDetails?._id === chatData.admin_id && (
          <>
            <button 
              onClick={handleAddUserClick} 
              className={chatinfocss.addUserButton}
            >
              {isAddingUser ? 'Cancel' : 'Add Participant'}
            </button>

            {isAddingUser && (
              <div className={chatinfocss.addUserInputContainer}>
                <input
                  type="email"
                  placeholder="Enter participant's email"
                  value={email}
                  onChange={handleEmailChange}
                  onKeyPress={handleKeyPress}
                  className={chatinfocss.emailInput}
                  disabled={isSubmitting}
                />
                <button 
                  onClick={handleAddUser} 
                  className={chatinfocss.addButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Adding...' : 'Add'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
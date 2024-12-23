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
<<<<<<< HEAD
>>>>>>> 7bdeee6de11f778df683293e6d6fa522206cab62
}
=======
}
>>>>>>> 56f9599197cc16b45cb1edbcd236d8f717058590

'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/components/AuthContext";
import { useFetchUserChats } from "@/app/api/services/useFetchChat";
import ChatDetails from "@/components/ChatDetails";
<<<<<<< HEAD
import chatPageCss from "@/styles/chatPage.module.css";
import AddUser from "./[chat_id]/AddUser";
import LeaveChat from "./LeaveChat";
import { Router } from "next/router";
export default function ChatPage() {
  const { tokenDetails } = useAuth();
  //@ts-expect-error
  const { chatsData, refetch } = useFetchUserChats(tokenDetails?._id);  // Add refetch to re-fetch chat data
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
<<<<<<< HEAD
  const [showAddUser, setShowAddUser] = useState<boolean>(false);
  const [showLeaveChat, setShowLeaveChat] = useState<boolean>(false); // Track if LeaveChat is visible
  const [searchQuery, setSearchQuery] = useState<string>(''); 
  const [chatResults, setChatResults] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string>(''); // Error state
  
  const router= useRouter();
=======
  const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false); // To toggle chat creation form
  const [chatName, setChatName] = useState<string>(''); // Store chat name
  const [emails, setEmails] = useState<string[]>([]); // Store user emails
=======
import chatPagecss from '@/styles/chatPage.module.css';

interface Chat {
  _id: string;
  name: string;
  lastMessage?: {
    content: string;
    timestamp: string;
  };
}

export default function ChatPage() {
>>>>>>> 56f9599197cc16b45cb1edbcd236d8f717058590
  const router = useRouter();
  const { tokenDetails } = useAuth();
  const { chatsData, refetch } = useFetchUserChats(tokenDetails?._id);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

<<<<<<< HEAD
>>>>>>> 7bdeee6de11f778df683293e6d6fa522206cab62
  if (!chatsData) return <h2>Loading...</h2>;
=======
  if (!chatsData) {
    return (
      <div className={chatPagecss.loadingContainer}>
        <span>Loading your chats...</span>
      </div>
    );
  }
>>>>>>> 56f9599197cc16b45cb1edbcd236d8f717058590

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
  };

  const currentChat = chatsData.find((chat) => chat._id === selectedChat);

  const handleRefreshChat = () => {
    refetch();
<<<<<<< HEAD
  };
  const handleAddUserSuccess = () => {
    setShowAddUser(false); // Hide the AddUser form on success
    refetch(); // Refresh chats to show the updated participants
  };

<<<<<<< HEAD
  const handleAddUserError = (message: string) => {
    console.error(message); // Log the error or show an appropriate message
  };
  // Handle chat leave success
  const handleLeaveChat = async (chat_id:string) =>{
    try{
      await axios.delete(`/chat/${chat_id}/leave`)
    }
  catch{
    alert('this is not working');
  }
  }
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Fetch chats by name when search query changes
  useEffect(() => {
    const fetchChats = async () => {
      if (!searchQuery) {
        setChatResults([]); // Clear results if search query is empty
        return;
      }

      setLoading(true);
      setError(''); // Clear error state before a new request

      try {
        const response = await axios.get(`/chat/search`, {
          params: { name: searchQuery },
        });

        if (response.status === 200) {
          setChatResults(response.data); // Set the search results
        } else {
          throw new Error('No chats found');
        }
      } catch (err: any) {
        setError('An error occurred while searching: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false); // Reset loading state after fetching
      }
    };

    fetchChats();
  }, [searchQuery]); 
=======
  const handleChatNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatName(e.target.value);
  };

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailInput = e.target.value;
    setEmails(emailInput.split(",").map(email => email.trim())); // Split emails by comma and trim whitespace
  };

  // Handle create chat form submission
  const handleCreateChat = () => {
    if (chatName && emails.length > 0) {
      const newChat = {
        name: chatName,
        emails: emails,
      };

      // Logic to send new chat data to the backend
      console.log("Creating new chat:", newChat);

      // Close the form after submission
      setIsCreatingChat(false);
      setChatName('');
      setEmails([]);

      // Redirect to the new chat's details page (optional)
      // router.push(`/chat/${newChat._id}`);
    }
=======
>>>>>>> 56f9599197cc16b45cb1edbcd236d8f717058590
  };

  const handleCreateNewChat = () => {
    router.push('/chat/create');
  };

  const formatLastMessage = (chat: Chat) => {
    if (!chat.lastMessage) return null;
    return {
      content: chat.lastMessage.content.length > 30 
        ? chat.lastMessage.content.substring(0, 30) + '...'
        : chat.lastMessage.content,
      timestamp: new Date(chat.lastMessage.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

>>>>>>> 7bdeee6de11f778df683293e6d6fa522206cab62
  return (
    <div className={chatPagecss.chatPageContainer}>
      <div className={chatPagecss.chatListContainer}>
        <h2 className={chatPagecss.sidebarTitle}>Your Chats</h2>
        <ul className={chatPagecss.chatList}>
          {chatsData.map((chat: Chat) => {
            const lastMessage = formatLastMessage(chat);
            return (
              <li
                key={chat._id}
                onClick={() => handleSelectChat(chat._id)}
                className={`${chatPagecss.chatListItem} ${
                  selectedChat === chat._id ? chatPagecss.activeChat : ""
                }`}
              >
                <div>
                  <div>{chat.name}</div>
                  {lastMessage && (
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: '#6b7280',
                      marginTop: '0.25rem' 
                    }}>
                      {lastMessage.content}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <button
          className={chatPagecss.createChatButton}
          onClick={handleCreateNewChat}
        >
          Create New Chat
        </button>
      </div>
<<<<<<< HEAD
  
      {/* Chat Details Section */}
      <div className={chatPageCss.chatDetailsContainer}>
=======

      <div className={chatPagecss.chatDetailsContainer}>
>>>>>>> 56f9599197cc16b45cb1edbcd236d8f717058590
        {currentChat ? (
<<<<<<< HEAD
          <>
            <ChatDetails
              chatData={currentChat}
              onBack={() => setSelectedChat(null)}
              onMessage={handleRefreshChat} // Pass the function to refresh chat
              onLeaveSuccess={() => router.push(`/chat`)}
            />
  
            {/* Add User Button */}
            <button
              onClick={() => setShowAddUser((prev) => !prev)}
              className={chatPageCss.addUserButton}
            >
              {showAddUser ? "Cancel" : "Add User"}
            </button>
  
            {showAddUser && (
              <AddUser
                onSuccess={handleAddUserSuccess}
                onError={handleAddUserError}
              />
            )}
  
            {/* Leave Chat Button */}
            <button
              onClick={() => setShowLeaveChat((prev) => !prev)}
              className={chatPageCss.leaveChatButton}
            >
              {showLeaveChat ? "Cancel" : "Leave Chat"}
            </button>
  
            {showLeaveChat && (
              <button onClick={() => handleLeaveChat(currentChat._id)}>
                Leave Chat
              </button>
            )}
          </>
=======
          <ChatDetails
            chatData={currentChat}
            onNewMessageSent={handleRefreshChat}
            onDetails={() => router.push(`/chat/${currentChat._id}`)}
          />
>>>>>>> 7bdeee6de11f778df683293e6d6fa522206cab62
        ) : (
          <div className={chatPagecss.placeholder}>
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
  
      {/* Search Section */}
      <div className={chatPageCss.searchContainer}>
        <h2>Search Chats</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          placeholder="Search for a chat by name"
        />
        {loading && <p>Loading search results...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
<<<<<<< HEAD
  
  
  
=======
>>>>>>> 56f9599197cc16b45cb1edbcd236d8f717058590
}
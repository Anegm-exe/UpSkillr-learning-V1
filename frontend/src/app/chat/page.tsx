'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/components/AuthContext";
import { useFetchUserChats } from "@/app/api/services/useFetchChat";
import ChatDetails from "@/components/ChatDetails";
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
  const router = useRouter();

>>>>>>> 7bdeee6de11f778df683293e6d6fa522206cab62
  if (!chatsData) return <h2>Loading...</h2>;

  // Handler for selecting a chat
  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
  };

  // Find the selected chat data
  const currentChat = chatsData.find((chat) => chat._id === selectedChat);

  // Function to handle refreshing chat data after sending a message
  const handleRefreshChat = () => {
    refetch();
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
  };

  const handleCreateNewChat = () => {
    router.push('/chat/create'); // Redirect to the create chat page
  };

>>>>>>> 7bdeee6de11f778df683293e6d6fa522206cab62
  return (
    <div className={chatPageCss.chatPageContainer}>
      {/* Sidebar with Chat List */}
      <div className={chatPageCss.chatListContainer}>
        <h2 className={chatPageCss.sidebarTitle}>Chats</h2>
        <ul className={chatPageCss.chatList}>
          {chatsData.map((chat: any) => (
            <li
              key={chat._id}
              onClick={() => handleSelectChat(chat._id)}
              className={`${chatPageCss.chatListItem} ${
                selectedChat === chat._id ? chatPageCss.activeChat : ""
              }`}
            >
              {chat.name}
            </li>
          ))}
        </ul>
        {/* Create Chat Button */}
        <button
          className={chatPageCss.createChatButton}
          onClick={handleCreateNewChat}
        >
          Create New Chat
        </button>
      </div>
  
      {/* Chat Details Section */}
      <div className={chatPageCss.chatDetailsContainer}>
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
            onNewMessageSent={handleRefreshChat}  // Pass the function to refresh chat
            onDetails={() => router.push(`/chat/${currentChat._id}`)}
          />
>>>>>>> 7bdeee6de11f778df683293e6d6fa522206cab62
        ) : (
          <div className={chatPageCss.placeholder}>
            <p>Select a chat to view details.</p>
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
  
  
  
}
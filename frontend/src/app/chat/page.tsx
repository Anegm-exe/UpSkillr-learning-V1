'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useFetchUserChats } from "@/app/api/services/useFetchChat";
import ChatDetails from "@/components/ChatDetails";
import chatPageCss from "@/styles/chatPage.module.css";

export default function ChatPage() {
  const { tokenDetails } = useAuth();
  //@ts-expect-error
  const { chatsData, refetch } = useFetchUserChats(tokenDetails?._id);  // Add refetch to re-fetch chat data
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false); // To toggle chat creation form
  const [chatName, setChatName] = useState<string>(''); // Store chat name
  const [emails, setEmails] = useState<string[]>([]); // Store user emails
  const router = useRouter();

  if (!chatsData) return <h2>Loading...</h2>;

  // Handler for selecting a chat
  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
  };

  // Find the selected chat data
  const currentChat = chatsData.find((chat) => chat._id === selectedChat);

  // Function to handle refreshing chat data after sending a message
  const handleRefreshChat = () => {
    refetch(); // Trigger the refetching of chat data to get updated messages
  };

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
          <ChatDetails
            chatData={currentChat}
            onNewMessageSent={handleRefreshChat}  // Pass the function to refresh chat
            onDetails={() => router.push(`/chat/${currentChat._id}`)}
          />
        ) : (
          <div className={chatPageCss.placeholder}>
            <p>Select a chat to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useFetchUserChats } from "@/app/api/services/useFetchChat";
import ChatDetails from "@/components/ChatDetails";
import chatPageCss from "@/styles/chatPage.module.css";

export default function ChatPage() {
  const router = useRouter();
  const { tokenDetails } = useAuth();
  const { chatsData, refetch } = useFetchUserChats(tokenDetails?._id);  // Add refetch to re-fetch chat data
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

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
      </div>

      {/* Chat Details Section */}
      <div className={chatPageCss.chatDetailsContainer}>
        {currentChat ? (
          <ChatDetails
            chatData={currentChat}
            onBack={() => setSelectedChat(null)}
            onNewMessageSent={handleRefreshChat}  // Pass the function to refresh chat
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

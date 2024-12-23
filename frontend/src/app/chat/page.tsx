'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { useFetchUserChats } from "@/app/api/services/useFetchChat";
import ChatDetails from "@/components/ChatDetails";
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
  const router = useRouter();
  const { tokenDetails } = useAuth();
  const { chatsData, refetch } = useFetchUserChats(tokenDetails?._id);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  if (!chatsData) {
    return (
      <div className={chatPagecss.loadingContainer}>
        <span>Loading your chats...</span>
      </div>
    );
  }

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
  };

  const currentChat = chatsData.find((chat) => chat._id === selectedChat);

  const handleRefreshChat = () => {
    refetch();
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

      <div className={chatPagecss.chatDetailsContainer}>
        {currentChat ? (
          <ChatDetails
            chatData={currentChat}
            onNewMessageSent={handleRefreshChat}
            onDetails={() => router.push(`/chat/${currentChat._id}`)}
          />
        ) : (
          <div className={chatPagecss.placeholder}>
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';
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
  
}

'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFetchChat } from "@/app/api/services/useFetchChat"; // Hook for fetching chat data
import axios from '../api/axios'; // Ensure axios is configured properly
import ChatDetails from "@/components/ChatDetails";
import LeaveChat from "./LeaveChat";

// Define SearchChats directly within ChatPage component
export default function ChatPage({ params }: { params: { chat_id: string } }) {
  const { chat_id } = params;
  const { chatData, refetch } = useFetchChat(chat_id); // Assuming useFetchChat returns chat data and a refetch function
  const [replyToMessageId, setReplyToMessageId] = useState<string | null>(null); // State for tracking reply context
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query state
  const [chatResults, setChatResults] = useState<any[]>([]); // Search results state
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string>(''); // Error state
  const router = useRouter();

  // Function to handle new message sent
  const handleNewMessageSent = async () => {
    try {
      await refetch(chatData); // Refetch chat data after a new message is sent
    } catch (error) {
      console.error("Error refetching chat data:", error);
    }
  };

  // Function to handle reply to a message
  const handleReplyClick = (messageId: string) => {
    setReplyToMessageId(messageId); // Set the reply context
  };

  // Function to handle leaving the chat
  const handleLeaveSuccess = () => {
    alert("You have successfully left the chat!");
    router.push("/chats"); // Redirect user to the chat list page
  };

  // Handle search query change
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
        const response = await axios.get(`/api/chat/search`, {
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
  }, [searchQuery]); // Re-fetch whenever the search query changes

  // Loading state or error handling
  if (!chatData) return <h2>Loading chat...</h2>;

  return (
    <div>
      <div>
        <h2>Search Chats</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          placeholder="Search for a chat by name"
        />

        {loading && <p>Loading search results...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div>
          {chatResults.length > 0 ? (
            <ul>
              {chatResults.map((chat) => (
                <li key={chat._id}>
                  <strong>{chat.name}</strong> - {chat.members.length} member(s)
                </li>
              ))}
            </ul>
          ) : (
            <p>No chats found</p>
          )}
        </div>
      </div>

      <ChatDetails
        chatData={chatData}
        onMessage={handleNewMessageSent} // Callback for when a new message is sent
        onReplyClick={handleReplyClick} // Callback for handling replies
        replyToMessageId={replyToMessageId} // Pass reply state
        onLeaveSuccess={handleLeaveSuccess} // Callback for leaving chat
        onBack={() => {
          // Implement the onBack functionality
          router.push('/chat'); // Example: Navigate back to chat list
        }}
        onChatDetails={() => {
          // Implement the onChatDetails functionality if needed
        }}
      />
      <LeaveChat 
        chatId={chat_id} 
        onLeaveSuccess={handleLeaveSuccess} //leave done
      />
    </div>
  );
}

'use client'
import React, { useEffect, useState } from 'react';
import { getChatDetails, sendMessage } from '../chatService';

const ChatDetails: React.FC<{ chatId: string }> = ({ chatId }) => {
  const [chatDetails, setChatDetails] = useState<any>(null);


  useEffect(() => {
    const fetchChatDetails = async () => {
      try {
        const details = await getChatDetails(chatId);
        setChatDetails(details);
      }

      catch (error) {
        console.error('Error fetching the chat details:', error);
      }
    };
    fetchChatDetails();
  }, [chatId]);


  if (!chatDetails) return <div>Loading...</div>;

  return (
    <div>
      <h2>{chatDetails.name}</h2>
      <div>
        {chatDetails.messages.map((msg: any) => (
          <p key={msg._id}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ChatDetails;

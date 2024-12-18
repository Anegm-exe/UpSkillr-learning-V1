'use client'
import React, { useEffect, useState } from 'react';
import { getChatDetails, sendMessage } from '../chat/chatService';

const ChatDetails: React.FC<{ chatId: string }> = ({ chatId }) => {
  const [chatDetails, setChatDetails] = useState<any>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchChatDetails = async () => {
      const details = await getChatDetails(chatId);
      setChatDetails(details);
    };
    fetchChatDetails();
  }, [chatId]);

  const handleSendMessage = async () => {
    await sendMessage(chatId, message); //darab error lama kont 3amla el message string array
    setMessage('');
    // Optionally refresh chat details after sending
  };

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
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default ChatDetails;

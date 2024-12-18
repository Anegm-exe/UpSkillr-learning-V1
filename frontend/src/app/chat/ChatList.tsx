import React, { useEffect, useState } from 'react';
import { getAllChats } from '../chat/chatService';

const ChatList: React.FC<{ userId: string }> = ({ userId }) => {
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      const chatData = await getAllChats(userId);
      setChats(chatData);
    };
    fetchChats();
  }, [userId]);

  return (
    <div>
      <h1>Your Chats</h1>
      <ul>
        {chats.map((chat) => (
          <li key={chat._id}>
            {chat.name} ({chat.participants.length} participants)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
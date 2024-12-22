"use client";
import { useEffect, useState } from "react";
import axios from '../api/axios'; 

export default function ChatList({ userId }: { userId: string }) {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/chats?=${userId}`);
        setChats(response.data); 
      } catch (err: any) {
        setError("Failed to fetch chats: " + (err.response?.data?.message || err.message));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchChats();
    }
  }, [userId]);

  if (loading) return <p>Loading chats...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Your Chats</h2>
      {chats.length > 0 ? (
        <ul>
          {chats.map((chat) => (
            <li key={chat.id}>
              <p><strong>{chat.chatName}</strong></p>
              <p>Members: {chat.members?.join(", ")}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No chats available.</p>
      )}
    </div>
  );
}

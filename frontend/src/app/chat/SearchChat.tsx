'use client'
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function SearchChats() {
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search query state
  const [chatResults, setChatResults] = useState<any[]>([]); // Search results state
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string>(''); // Error state

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

  return (
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
  );
}

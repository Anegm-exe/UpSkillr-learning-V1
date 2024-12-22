'use client'
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

export default function ChatForm() {
  const [chatName, setChatName] = useState<string>('');
  const [emails, setEmails] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [chatId, setChatId] = useState<string | null>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [chatResults, setChatResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [addUserEmail, setAddUserEmail] = useState<string>('');
  const [messageId, setMessageId] = useState<string | null>('');
  const [success, setSuccess] = useState('');

  // handling emails (comma separated)
  const handleEmailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmails(e.target.value);
  };

  // Handle creating the chat
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const emailList = emails.split(',').map((email) => email.trim());

    const createChatDTO = { chatName };

    try {
      const response = await axios.post('/api/chats', {
        chat: createChatDTO,
        emails: emailList,
      });

      if (response.data) {
        alert('Chat created successfully!');
        setChatId(response.data._id);
      } else {
        throw new Error('Failed to create chat');
      }
    } catch (err: any) {
      setError('An error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // handle delete chat
  const handleDelete = async () => {
    if (!chatId) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.delete(`/api/chats/${chatId}`);

      if (response.data) {
        alert('Chat deleted successfully!');
        setChatId(null); // chat id is reset after deletion
      } else {
        throw new Error('Failed to delete chat');
      }
    } catch (err: any) {
      setError('An error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // handle search for chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!searchQuery) {
        setChatResults([]); // clear if the query is empty
        return;
      }

      setSearchLoading(true);
      setError('');

      try {
        const response = await axios.get(`/api/chats/search/${searchQuery}`);
        setChatResults(response.data || []);
      } catch (err: any) {
        setError('Error fetching search results: ' + err.message);
      } finally {
        setSearchLoading(false);
      }
    };

    fetchChats();
  }, [searchQuery]);

  // handle adding a user to a chat
  const handleAddUserToChat = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`/chats/user/${addUserEmail}`);

      if (response.data) {
        alert('User added to chat successfully!');
        setAddUserEmail('');
      } else {
        throw new Error('Failed to add user to the chat');
      }
    } catch (err: any) {
      setError('An error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // handle deleting a message
  const handleDeleteMessage = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.delete(`/api/chats/${chatId}/message/${messageId}`);

      if (response.data) {
        setSuccess('Message deleted successfully.');
        setChatId('');
        setMessageId('');
      } else {
        throw new Error('Failed to delete message');
      }
    } catch (err: any) {
      setError('An error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create a New Chat</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Chat Name:</label>
          <input
            type="text"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email Addresses:</label>
          <input
            type="text"
            value={emails}
            onChange={handleEmailsChange}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Chat...' : 'Create Chat'}
        </button>
      </form>

      {chatId && (
        <div>
          <h3>Chat Settings</h3>
          <button onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting Chat...' : 'Delete Chat'}
          </button>
        </div>
      )}

      <hr />

      <h3>Search Chats</h3>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a chat by name"
      />
      {searchLoading && <p>Loading search results...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {chatResults.length > 0 ? (
          <ul>
            {chatResults.map((chat) => (
              <li key={chat._id}>
                <strong>{chat.name}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p>No chats found</p>
        )}
      </div>

      <hr />

      <h3>Manage Chat Members</h3>
      <div>
        <label>User Email:</label>
        <input
          type="text"
          value={addUserEmail}
          onChange={(e) => setAddUserEmail(e.target.value)}
          placeholder="Enter user email"
        />
      </div>
      <button onClick={handleAddUserToChat} disabled={loading || !addUserEmail}>
        {loading ? 'Adding User...' : 'Add User to Chat'}
      </button>

      <hr />

      <h3>Delete Message from Chat</h3>
      <div>
        <label>Chat ID:</label>
        <input
          type="text"
          value={chatId || ''}
          onChange={(e) => setChatId(e.target.value)}
          placeholder="Enter chat ID"
        />
      </div>
      <div>
        <label>Message ID:</label>
        <input
          type="text"
          value={messageId || ''}
          onChange={(e) => setMessageId(e.target.value)}
          placeholder="Enter message ID"
        />
      </div>
      <button onClick={handleDeleteMessage} disabled={loading || !chatId || !messageId}>
        {loading ? 'Deleting...' : 'Delete Message'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}

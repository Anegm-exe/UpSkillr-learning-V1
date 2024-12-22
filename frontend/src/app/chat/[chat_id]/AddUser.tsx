'use client'
import React, { useState } from 'react';
import axios from '../../api/axios'; // Ensure axios is properly configured
import { useRouter } from 'next/navigation'; // To handle navigation after adding user
import { useParams } from 'next/navigation'; // To access the dynamic route parameter (chat_id)

const AddUser = ({ onSuccess, onError }: { onSuccess: () => void; onError: (message: string) => void }) => {
  const [email, setEmail] = useState<string>(''); // State to track email input
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string>(''); // Error state
  const { chat_id } = useParams(); // Get chatId from the URL params
  const router = useRouter();

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Handle Add User button click
  const handleAddUser = async () => {
    if (!email) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!chat_id) {
      setError('Chat ID not found.');
      return;
    }

    setLoading(true);
    setError(''); // Reset any previous error

    try {
      // Call the API to add the user to the chat
      const response = await axios.post(`/api/chat/${chat_id}/user/${email}`);

      if (response.status === 200) {
        // On success, clear the email and navigate back
        onSuccess(); // Call the success callback
        setEmail(''); // Clear email input field
        router.push(`/chat/${chat_id}`); // Redirect to the chat page or another page after adding user
      } else {
        throw new Error('Failed to add user.');
      }
    } catch (err: any) {
      // Handle any error during the process
      onError(err?.message || 'An error occurred while adding the user.');
      setError(err?.message || 'An error occurred while adding the user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add User to Chat</h2>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Enter user email"
        disabled={loading}
      />
      <button onClick={handleAddUser} disabled={loading}>
        {loading ? 'Adding...' : 'Add User'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddUser;

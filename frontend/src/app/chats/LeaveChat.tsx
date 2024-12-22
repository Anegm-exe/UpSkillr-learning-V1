'use client'
import React, { useState } from 'react';
import axios from '../api/axios';

export default function LeaveChat({ chatId, onLeaveSuccess }: { chatId: string, onLeaveSuccess: () => void }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Handle leaving the chat
  const handleLeaveChat = async () => {
    setLoading(true);
    setError(''); // Clear any previous error

    try {
      const response = await axios.delete(`/chats/${chatId}/leave`);

      if (response.data) {
        onLeaveSuccess();
        alert('You have left the chat successfully!');
      } else {
        throw new Error('Failed to leave the chat');
      }
    } catch (err: any) {
      setError('An error occurred: ' + err.message); 
      setLoading(false); 
    }
  };

  return (
    <div>
      <h3>Leave Chat</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLeaveChat} disabled={loading}>
        {loading ? 'Leaving Chat...' : 'Leave Chat'}
      </button>
    </div>
  );
}

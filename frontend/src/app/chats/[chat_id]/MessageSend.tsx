'use client'
import React, { useState } from 'react';
import axios from '../../api/axios'
export default function MessageSend({ chatId, onMessageSent }: { chatId: string, onMessageSent: () => void }) {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear any previous error

    try {
      const response = await axios.post(`/chats/${chatId}/send`);
      if (!response.data) {
        throw new Error('Failed to send message');
      }

      setMessage(''); // clear the message field after successful submission
      onMessageSent(); //notify parent component of message
    } catch (err: any) {
      setError(err.message); 
    } 
    setLoading(false); 
    
  };

  return (
    <form onSubmit={handleSendMessage}>
      <div>
        <label>Message:</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}

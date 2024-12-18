import React, { useState } from 'react';

const LeaveChat: React.FC<{
  chatId: string;
  onLeaveSuccess: () => void; //to redirect back for example
}> = ({ chatId, onLeaveSuccess }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleLeaveChat = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/chat/${chatId}/leave`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to leave the chat');
      }

      onLeaveSuccess(); // Call the callback after successful leave
      alert('You have left the chat successfully!');
    } catch (err: any) {
      setError('An error occurred: ' + err.message);
    } finally {
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
};

export default LeaveChat;

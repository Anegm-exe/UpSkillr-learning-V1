import React, { useState } from 'react';
import { replyToMessage } from '../chat/chatService';

interface ReplyMessageProps {
  chatId: string;
  messageId: string;
  onReplySuccess: (updatedChat: any) => void;
}

const ReplyMessageComponent: React.FC<ReplyMessageProps> = ({ chatId, messageId, onReplySuccess }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleReply = async () => {
    try {
      const userToken = localStorage.getItem('token'); // get the actual storagee
      const updatedChat = await replyToMessage(chatId, messageId, text, userToken || undefined);
      onReplySuccess(updatedChat);
      setText(''); // the input cleared on success
    } catch (err) {
      setError('Failed to send reply. Please try again.');
    }
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your reply here..."
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleReply}>Send Reply</button>
    </div>
  );
};

export default ReplyMessageComponent;

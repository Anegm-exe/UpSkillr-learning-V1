import React, { useState } from 'react';

type ReplyMessageProps = {
    chatId: string; 
    messageId: string; 
    handleReplySent : () => void;
 // Corrected function type syntax
};
const ReplyMessageForm: React.FC<ReplyMessageProps> = ({ chatId, messageId }) => {
    const [reply, setReply] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [notification, setNotification] = useState<string>('');
    const handleReplySent = () => {
        setNotification('Reply was sent!'); // Display a success message
        setTimeout(() => setNotification(''), 3000); // Clear the message after 3 seconds
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/chat/${chatId}/reply/${messageId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: reply }),
            });

            if (!response.ok) {
                throw new Error('Failed to send reply');
            }

            setReply(''); // Clear the reply field
            handleReplySent(); // Notify parent component
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleReply}>
            <div>
                <label>Reply:</label>
                <input
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    required
                />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" disabled={loading}>
                {loading ? 'Sending Reply...' : 'Send Reply'}
            </button>
            return (
        <div>
            <ReplyMessageForm
                chatId="12345"
                messageId="67890"
                handleReplySent={handleReplySent} // Passing the function as a prop
            />
            {notification && <p style={{ color: 'green' }}>{notification}</p>}
        </div>
    );
        </form>
    );
};

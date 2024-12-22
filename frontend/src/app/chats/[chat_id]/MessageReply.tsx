'use client'
import React, { useState } from 'react';
import axios from '../../api/axios';

export default function ReplyMessage({ chatId, messageId, handleReplySent }: { chatId: string; messageId: string; handleReplySent: () => void }) {
    const [reply, setReply] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [notification, setNotification] = useState<string>('');

    // handle when a reply is sent successfully
    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`/chats/${chatId}/reply/${messageId}`, {
                message: reply,
            });

            if (response.status !== 200) {
                throw new Error('Failed to send reply');
            }

            setReply(''); // clear after submitting a reply
            handleReplySent(); // Notify the message parent component
            setNotification('Reply was sent!');
            setTimeout(() => setNotification(''), 3000); // notification cleared after 3 seconds
        } catch (err: any) {
            setError(err.message);
        }
        setLoading(false);

    };

    return (
        <div>
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
            </form>
            {notification && <p style={{ color: 'green' }}>{notification}</p>}
        </div>
    );
}

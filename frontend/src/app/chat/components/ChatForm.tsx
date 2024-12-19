'use client'
import React, { useState, useEffect } from 'react';

const ChatForm: React.FC = () => {
    const [chatName, setChatName] = useState<string>('');
    // storing the name of the new chat
    const [emails, setEmails] = useState<string>('');
    // storing emails of new chat members
    const [error, setError] = useState<string>('');
    //  storing any error messages
    const [loading, setLoading] = useState<boolean>(false);
    //  tracking loading state during creation and deletion
    const [chatId, setChatId] = useState<string | null>(null);
    // storing the chat ID (for deletion)
    const [searchQuery, setSearchQuery] = useState<string>('');
    // storing search query
    const [chatResults, setChatResults] = useState<any[]>([]);
    // storing search results (chat names)
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    // tracking loading state during search
    const [addUserChatId, setAddUserChatId] = useState<string>(''); //hal hwa hwa nafs el email
    // storing chatID for adding user
    const [addUserEmail, setAddUserEmail] = useState<string>('');
    //storing emails of users
    // handling email input change, comma seperated
    const handleEmailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmails(e.target.value);
    };

    // handling creating chat by form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const emailList = emails.split(',').map((email) => email.trim());

        const createChatDTO = {
            chatName,
        };

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat: createChatDTO,
                    emails: emailList,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create chat');
            }

            const result = await response.json();
            alert('Chat created successfully!');
            setChatId(result._id);
        } catch (err: any) {
            setError('An error occurred: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // delete chat handler
    const handleDelete = async () => {
        if (!chatId) return;
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/chat/${chatId}`, { method: 'DELETE' });

            if (!response.ok) throw new Error('Failed to delete chat');
            alert('Chat deleted successfully!');
            setChatId(null); // Reset chat ID after deletion
        } catch (err: any) {
            setError('An error occurred: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // search for chat by name
    useEffect(() => {
        const fetchChats = async () => {
            if (!searchQuery) {
                setChatResults([]);  // if query is empty clear 
                return;
            }

            setSearchLoading(true);
            setError('');

            try {
                const response = await fetch(`/api/chat/search/${searchQuery}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch search results');
                }

                const data = await response.json();
                setChatResults(data); // set the search results in the state
            } catch (err: any) {
                setError(err.message); // set error message if request fails
            } finally {
                setSearchLoading(false); // reset loading state
            }
        };

        fetchChats();
    }, [searchQuery]); // fetch chats when the searchQuery changes (bardo ask your teammates abt it)
    // Handle adding a user to a chat
    const handleAddUserToChat = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/chat/user/${addUserEmail}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Failed to add user to the chat');
            }

            alert('User added to chat successfully!');
            setAddUserChatId('');
            setAddUserEmail('');
        } catch (err: any) {
            setError(err.message);
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
        </div>
    );
};
// what i've done so far
// 1. create a chat
// 2. delete a chat
// 3. search for a user by name
// 4. add a user to chat
// 5. getting a chat's details (in a page on its own)
// 6. fetching all chats of a single user
// 7. leave a chat (in a page on its own bas ask if i can put it inside my chat form)
// 
export default ChatForm;

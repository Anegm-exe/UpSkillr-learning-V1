'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import axios from '@/app/api/axios';
import chatdetailcss from '@/styles/chatdetailcss.module.css';

export default function CreateChatPage() {
  const router = useRouter();
  const [chatName, setChatName] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [error, setError] = useState('');
  const { tokenDetails } = useAuth();

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleAddEmail = () => {
    if (!currentEmail) return;
    
    if (!validateEmail(currentEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (emails.includes(currentEmail)) {
      setError('This email is already added');
      return;
    }

    setEmails([...emails, currentEmail]);
    setCurrentEmail('');
    setError('');
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleCreateChat = () => {
    if (!chatName) {
      setError('Please enter a chat name');
      return;
    }

    if (emails.length === 0) {
      setError('Please add at least one email');
      return;
    }

    const newChat = {
      chat: {
        admin_id: tokenDetails?._id,
        name: chatName,
      },
      emails: emails,
    };

    axios.post("/chat", newChat);
    router.push('/chat');
  };

  return (
    <div className={chatdetailcss.container}>
      <div className={chatdetailcss.card}>
        <h2 className={chatdetailcss.title}>Create New Chat</h2>
        
        {error && <div className={chatdetailcss.error}>{error}</div>}

        <div className={chatdetailcss.formGroup}>
          <label className={chatdetailcss.label}>Chat Name</label>
          <input
            type="text"
            placeholder="Enter chat name"
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            className={chatdetailcss.input}
          />
        </div>

        <div className={chatdetailcss.formGroup}>
          <label className={chatdetailcss.label}>Add Participants</label>
          <div className={chatdetailcss.emailInputGroup}>
            <input
              type="email"
              placeholder="Enter email address"
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddEmail();
                }
              }}
              className={`${chatdetailcss.input} ${chatdetailcss.inputFlex}`}
            />
            <button onClick={handleAddEmail} className={chatdetailcss.addButton}>
              Add
            </button>
          </div>

          {emails.length > 0 && (
            <div className={chatdetailcss.emailList}>
              {emails.map((email) => (
                <div key={email} className={chatdetailcss.emailTag}>
                  <span>{email}</span>
                  <button
                    onClick={() => handleRemoveEmail(email)}
                    className={chatdetailcss.removeButton}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={chatdetailcss.buttonGroup}>
          <button onClick={handleCreateChat} className={chatdetailcss.primaryButton}>
            Create Chat
          </button>
          <button
            onClick={() => router.push('/chat')}
            className={chatdetailcss.secondaryButton}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
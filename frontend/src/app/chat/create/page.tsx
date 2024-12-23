'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import chatPageCss from "@/styles/chatPage.module.css";
import { useAuth } from "@/components/AuthContext";
import axios from '@/app/api/axios';

export default function CreateChatPage() {
  const router = useRouter();
  const [chatName, setChatName] = useState<string>(''); // Store chat name
  const [emails, setEmails] = useState<string[]>([]); // Store user emails
  const { tokenDetails } = useAuth();

  // Handle chat name change
  const handleChatNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatName(e.target.value);
  };

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailInput = e.target.value;
    setEmails(emailInput.split(",").map(email => email.trim())); // Split emails by comma and trim whitespace
  };

  // Handle create chat form submission
  const handleCreateChat = () => {
    if (chatName && emails.length > 0) {
      const newChat = {
        chat: {
          admin_id: tokenDetails?._id,
          name: chatName,
        },
        emails: emails,
      };
      axios.post("/chat", newChat);
      console.log("Creating new chat:", newChat);

      // Redirect to chat list or details page
      router.push('/chat');
    }
  };

  return (
    <div className={chatPageCss.container}>
      <div className={chatPageCss.formContainer}>
        <h2 className={chatPageCss.title}>Create New Chat</h2>
        
        {/* Chat Name Input */}
        <div className={chatPageCss.inputGroup}>
          <label className={chatPageCss.label}>Chat Name</label>
          <input
            type="text"
            placeholder="Enter chat name"
            value={chatName}
            onChange={handleChatNameChange}
            className={chatPageCss.inputField}
          />
        </div>

        {/* Emails Input */}
        <div className={chatPageCss.inputGroup}>
          <label className={chatPageCss.label}>User Emails</label>
          <input
            type="text"
            placeholder="Enter user emails (comma separated)"
            value={emails.join(", ")}
            onChange={handleEmailChange}
            className={chatPageCss.inputField}
          />
        </div>

        {/* Buttons */}
        <div className={chatPageCss.buttonGroup}>
          <button onClick={handleCreateChat} className={chatPageCss.createButton}>
            Create Chat
          </button>
          <button
            onClick={() => router.push('/chat')}
            className={chatPageCss.cancelButton}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

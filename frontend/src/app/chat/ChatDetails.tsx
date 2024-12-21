'use client';
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useRouter } from 'next/router';

export default function ChatDetails(){
  const router= useRouter();
  const[formData, setFormData]=useState({chatId:""}); 
  const [chatDetails, setChatDetails]= useState<any>(null);
  const[loading, setLoading]= useState(false);
  const[error, setError]=useState<string |null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/chat/${formData.chatId}`);
      setChatDetails(response.data); 
      console.log("Chat details fetched:", response.data);
    } catch (err: any) {
      setError("Failed to fetch chat details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
return{

}
};

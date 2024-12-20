import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

export const getMessages = async (forumId: string) => {
    const response = await axios.get(`/forums/forumMsgs/${forumId}`);
    return response.data;
}
export default function Forum(params : {forumId: string}) {
    return <h1>Forum Page {params}</h1>;
}
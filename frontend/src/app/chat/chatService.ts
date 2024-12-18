import axios from 'axios';

// Set the base URL of your backend API
const BASE_URL = 'http://localhost:3000/chat';

// Get all chats for a user
export const getAllChats = async (userId: string) => {
  const response = await axios.get(`${BASE_URL}/user/${userId}`);
  return response.data;
};

// Get chat details
export const getChatDetails = async (chatId: string) => {
  const response = await axios.get(`${BASE_URL}/${chatId}`);
  return response.data;
};

// creating a new chat
export const createChat = async (chatData: any, emails: string[]) => {
  const response = await axios.post(BASE_URL, { chat: chatData, emails });
  return response.data;
};

// sending a message to a chat
export const sendMessage = async (chatId: string, message: string) => {
  const response = await axios.post(`${BASE_URL}/${chatId}/send`, { message });
  return response.data;
};

// add a user to a chat
export const addUserToChat = async (chatId: string, email: string) => {
  const response = await axios.post(`${BASE_URL}/${chatId}/user/${email}`);
  return response.data;
};

// remove a user from a chat
export const removeUserFromChat = async (chatId: string, userId: string) => {
  const response = await axios.delete(`${BASE_URL}/${chatId}/user/${userId}`);
  return response.data;
};
//reply to a message
export const replyToMessage = async (
    chatId: string,
    messageId: string,
    text: string,
    getTokenDetails?: string
  ) => {
    try {
      const headers = getTokenDetails ? { Authorization: `Bearer ${getTokenDetails}` } : {};
      const response = await axios.post(
        `${BASE_URL}/${chatId}/reply/${messageId}`,
        { message: text },
        { headers } // Include authorization headers if necessary
      );
      return response.data; // Return the updated chat object
    } catch (error) {
      console.error('Error replying to message:', error);
      throw error;
    }
  };

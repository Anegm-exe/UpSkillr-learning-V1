import React from 'react';
import ChatList from '../../components/ChatList';

const UserChatPage = ({ params }: { params: { user_id: string } }) => {
  const { user_id } = params;

  return (
    <div>
      <h1>User Chats</h1>
      <ChatList userId={user_id} />
    </div>
  );
};

export default UserChatPage;
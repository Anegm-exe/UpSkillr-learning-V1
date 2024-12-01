import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from '../schemas/chat.schema';
import { Message, MessageDocument } from 'src/schemas/message.schema';
import { Model } from 'mongoose'
//import {userS} //import user service to check if email exists for a user's db

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
  // @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>
  ) { }
  async createChat( createChatDto: Partial<Chat>, emails:string[]): Promise<Chat> {
  //   const user_ids = await Promise.all(
  //     emails.map(async (email) => {
  //         return (await this..create(question))._id;
  //     }
  // )); 
    createChatDto.user_ids.push()
    const newChat = new this.chatModel(createChatDto); //dto for creating a chat
    return newChat.save(); // saves to db
  }
  async findAllChats(User_Id: string) {
    const chats = await this.chatModel.find({ User_id: User_Id });
    return chats;
  }
  async getChatDetails(chat_id: String) {
    const chat = await this.chatModel.findById({ _id: chat_id });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return this.chatModel.findById({ _id: chat_id })
  }
  async getRecentChat(chat_id: string) {
    const recent_chat = await this.chatModel.find({ _id: chat_id }).sort().exec();
    if (!recent_chat) {
      throw new NotFoundException('not found');
    }
    return recent_chat;
  }

  async deleteChat(chat_id: string) {
    const chat = await this.chatModel.findById({_id: chat_id})
    if (!chat) {
      throw new Error('chat not found');
    }
    await this.chatModel.deleteOne({ chat_id }, { deletedAt: new Date() });
    return { success: true };
  }

}
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from '../schemas/chat.schema';
import { Message, MessageDocument } from 'src/schemas/message.schema';
import { Model } from 'mongoose'
import { UserService } from '../user/user.service';
import { User } from 'src/schemas/user.schema';
import { CreateChatDTO, UpdateChatDTO } from './chat.dto';
import { timeStamp } from 'console';
import { MessageService } from 'src/message/message.service';
@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    private readonly UserService: UserService,
    private readonly MessageService: MessageService

    // @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>
  ) { }
  async createChat(createChatDto: CreateChatDTO, emails: string[]): Promise<Chat> {
    //loop around emails to get an email then find the user by email if not null, get id
    const userIds = await Promise.all(
      emails.map(async (email) => {
        const user = (await this.UserService.findByEmail(email));
        if (user) {
          return user._id;
        }
      }
      ));
    createChatDto.user_ids = userIds;
    if (userIds.length >= 2) {
      const newChat = new this.chatModel(createChatDto); //dto for creating a chat
      return newChat.save(); // saves to db
    }
    throw new Error('Chat should have at least 2 users');
  }
  async findAllChats(User_Id: string) {
    const chats = await this.chatModel.find({ user_ids: User_Id });
    return chats;
  }
  async getChatDetails(chat_id: String, createChatDTO: CreateChatDTO) { //byakhod kaman el dto 3ashan yekon feha kol haga
    const chat = await this.chatModel.findById({ _id: chat_id }, createChatDTO);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return (await this.chatModel.findById({ _id: chat_id })).messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }


  async deleteChat(chat_id: string) {
    const chat = await this.chatModel.findById({ _id: chat_id })
    if (!chat) {
      throw new Error('chat not found');
    }
   await Promise.all(
      chat.messages.map(async (message) => {
           (await this.MessageService.delete(message._id));
      }
  ));
    await this.chatModel.deleteOne({ chat_id });
    return { success: true };
  }


  async updateChat(chat_id: string, updateChatDTO: UpdateChatDTO): Promise<Chat> {
    const chat = await this.chatModel.findById(chat_id);
    if (!chat) {
      throw new NotFoundException('Chat is not found');
    }
    if (updateChatDTO.add_users) {
      for (const user_ids of updateChatDTO.add_users) {
        chat.user_ids.push(user_ids);
      }
    }
    if (updateChatDTO.remove_users) {
      await this.chatModel.updateOne({ _id: chat_id }, {
        $pop: { user_ids: { $each: updateChatDTO.remove_users } }  // Append new elements to the array
      })
    };
    return await chat.save();
  }
}
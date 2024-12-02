import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateChatDTO, CreateMessageDTO, GetChatDetailsDTO, GetAllChatsDTO, GetRecentChatDTO, EditMessagesDTO, DeleteMessageDTO } from './chat.dto';
import { Chat, ChatDocument } from '../schemas/chat.schema';
import { Message, MessageDocument } from 'src/schemas/message.schema';
import { Model } from 'mongoose'

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>
  ) { }
  async createChat(User_Id, createChatDto: CreateChatDTO): Promise<Chat> {
    const newChat = new this.chatModel(User_Id, createChatDto); //dto for creating a chat
    return newChat.save(); // saves to db
  }
  async createMessage(createMessageDTO: CreateMessageDTO): Promise<Message> {
    const newMessage = new this.messageModel(createMessageDTO);
    return newMessage.save(); //saves my new message to the db
  }
  async findAllChats(chat_id, getAllChatsDTO: GetAllChatsDTO) {
    const User_Id = getAllChatsDTO.User_Id;
    const chats = await this.chatModel.findById(chat_id);
    return chats;
  }
  async getChatDetails(chat_id: String, getChatDetailsDto: GetChatDetailsDTO) {
    const chat = await this.chatModel.findById(chat_id);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return this.chatModel.findById(chat_id, getChatDetailsDto).sort(); //ezaayyy a3mela descendingg
  }
  async getRecentChat(chat_id, getRecentChat: GetRecentChatDTO) {
    const User_Id = getRecentChat;
    const recent_chat = await this.chatModel.find(chat_id).sort().exec();
    if (!recent_chat) {
      throw new NotFoundException('not found');
    }
    return recent_chat;
  }
  async editMessages(editMessages: EditMessagesDTO) {
    const message_id = EditMessagesDTO
    const message = await this.messageModel.findById(message_id);
    if (message) {
      message.text = editMessages.newText;
      return message.save()
    }
    throw new Error('You cannot edit this message')
  }
  async deleteChat(chat_id: string) {
    const chat = await this.chatModel.findById(chat_id)
    if (!chat) {
      throw new Error('chat not found');
    }
    await this.chatModel.deleteOne({ chat_id }, { deletedAt: new Date() });
    return { success: true };
  }
  async deleteMessage(chat_id: string, message_id: string, dto: DeleteMessageDTO) {
    const message = await this.messageModel.findOne({ where: { id: message_id, chat_id } }, dto);
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    await this.messageModel.deleteOne({ message_id }, { deletedAt: new Date() })
    return { success: true };
  }
  async editMessage(chat_id: string, message_id: string, newText: string) {
    const chat = await this.chatModel.findById(chat_id);
    if (!chat) {
      throw new Error('not found');
    }
    const message = chat.messages.find((message) => message._id == message_id);
    if (!message) {
      throw new NotFoundException('message not found');
    }
    message.text = newText;
    message.updatedAt = new Date();
    await this.messageModel.save(message);
    return this.chatModel.findOne({ chat_id }, ['messages']);
  }
}
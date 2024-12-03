import { ConflictException, Injectable, NotFoundException, Req, Res, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from '../schemas/chat.schema';
import { Message, MessageDocument } from 'src/schemas/message.schema';
import { Model } from 'mongoose'
import { UserService } from '../user/user.service';
import { User } from 'src/schemas/user.schema';
import { CreateChatDTO, UpdateChatDTO } from './dtos/chat.dto';
import { timeStamp } from 'console';
import { MessageService } from 'src/message/message.service';
import { Request } from 'express';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    private readonly UserService: UserService,
    private readonly MessageService: MessageService
  ) { }
  async createChat(createChatDto: CreateChatDTO, emails: string[]): Promise<Chat> {
    //loop around emails to get an email then find the user by email if not null, get id
    const userIds = await Promise.all(
      emails.map(async (email) => {
        try{
          const user = (await this.UserService.findByEmail(email));
        return user._id;
        }catch{
          throw new NotFoundException(`${email} was not found`);
        }
      }));
    createChatDto.user_ids = userIds;
    if (userIds.length >= 2) {
      const newChat = new this.chatModel(createChatDto); //dto for creating a chat
      return newChat.save(); // saves to db
    }
    throw new RangeError('Chat should have at least 2 users');
  }

  async findAllChats(User_Id: string) : Promise<Chat[]> {
    const chats = await this.chatModel.find({ user_ids: User_Id });
    if(!chats) {
      throw new NotFoundException("User has no chats")
    }
    return chats;
  }

  async getChatDetails(chat_id: String) : Promise<Chat> { //byakhod kaman el dto 3ashan yekon feha kol haga
    const chat = await this.chatModel
  .findById({ _id: chat_id })
  .populate([
    { path: 'messages', populate: { path: 'user_id', select: 'name' } }, // Populate only the name of the user in messages
    { path: 'user_ids', select: 'name' } // Populate only the name of the users in user_ids
  ])
  .exec();

      if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return chat;
  }

  // Send message on chat
  async sendMessage(chat_id: string, text: string, req: Request) {
    const chat = await this.chatModel.findById(chat_id);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    // Is user in chat
    if (!chat.user_ids.includes(req['user'].userid)) {
      throw new UnauthorizedException('You are not in this chat');
    }
    const message = await this.MessageService.create({
      text: text,
      user_id: req['user'].userid
    })
    chat.messages.push(message._id);
    return chat.save();
  }

  // Reply to a message
  async replyToMessage(chat_id: string, message_id: string, text: string, req: Request) : Promise<Chat> {
    const chat = await this.chatModel.findById(chat_id);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    // Is user in chat
    if (!chat.user_ids.includes(req['user'].userid)) {
      throw new UnauthorizedException('You are not in this chat');
    }
    // is the message in the chat
    if (!chat.messages.includes(message_id)) {
      throw new NotFoundException('Message not found in chat');
    }
    // create message
    const message = await this.MessageService.create({
      text: text,
      user_id: req['user'].userid,
      repliedTo_id: message_id
    });
    chat.messages.push(message._id);
    return chat.save();
  }

  async deleteChat(chat_id: string, req: Request) {
    const chat = await this.chatModel.findById({ _id: chat_id })
    if (!chat) {
      throw new Error('chat not found');
    }

    // Check if the requester is the chat admin
    if (chat.admin_id !== req['user'].userid) {
      throw new UnauthorizedException('You are not the admin of this chat');
    }

    // Delete all messages
   await Promise.all(
      chat.messages.map(async (id) => {
        try{
          await this.MessageService.delete(id);
        }catch (err){
          console.error(`Failed to delete message ${id}:`, err.message);
        }
      }
  ));
    await this.chatModel.deleteOne({ chat_id });
    return { success: true };
  }

  async addUserToChat(chat_id: string, email: string, req: Request): Promise<Chat> {
    // Find the chat by ID
    const chat = await this.chatModel.findById(chat_id);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
  
    // Check if the requester is the chat admin
    if (chat.admin_id !== req['user'].userid) {
      throw new UnauthorizedException('You are not the admin of this chat');
    }
  
    // Check if user with the email exist
    const user = await this.UserService.findByEmail(email);
    if(!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    // Add the user to the chat if not already added
    if (!chat.user_ids.includes(user._id)) {
      chat.user_ids.push(user._id);
    } else {
      throw new ConflictException('User is already a member of the chat');
    }
  
    // Save the updated chat and return the document
    return await chat.save();
  }
  

  // Remove user from chat
  async removeUsersFromChat(chat_id: string, user_id: string, req: Request): Promise<Chat> {
    // Find the chat by ID
    const chat = await this.chatModel.findById(chat_id);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
  
    console.log(req['user'] + " " + chat.admin_id)
    // Check if the requester is the chat admin
    if (chat.admin_id !== req['user'].userid) {
      throw new UnauthorizedException('You are not the admin of this chat');
    }
  
    // Check if the user ID exists in the chat's user list
    const userIndex = chat.user_ids.indexOf(user_id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found in this chat');
    }
  
    if(chat.user_ids.length<=2) {
      throw new ConflictException('Cannot remove the last two users from the chat');
    }
    // Remove the user ID from the chat
    chat.user_ids.splice(userIndex, 1);
  
    // Save the updated chat document
    return await chat.save();
  }

  // Delete message from chat
  async deleteMessageFromChat(chat_id: string, message_id: string, req: Request): Promise<void> {
    // Find the chat by ID
    const chat = await this.chatModel.findById(chat_id);
    if (!chat) {
      throw new NotFoundException('Chat not found');
      }

      // Find message in chat
      const index = chat.messages.indexOf(message_id);
      if (index === -1) {
        throw new NotFoundException('Message not found in this chat');
      }

      // Get the message
      const message = await this.MessageService.findOne(message_id);
      if(!message) {
        throw new NotFoundException('Message not found');
      }

      

      // Check if the requester is the chat admin or the one who sent the message
      if (chat.admin_id !== req['user'].userid || req['user'].userid !== message.user_id) {
        throw new UnauthorizedException('You are not authorized to delete this message');
      }

      // remove from message collection
      this.MessageService.delete(message_id);

      // remove from chat messages array
      chat.messages.splice(index, 1);
      
      return;
  }

  // Leave chat 
  async leaveChat(chat_id: string, req: Request): Promise<void> {
    // Find the chat by ID
    const chat = await this.chatModel.findById(chat_id);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    // find if user is in the chat
    const index = chat.user_ids.indexOf(req['user'].userid);
    if (index === -1) {
      throw new UnauthorizedException('You are not in this chat');
    }

    // check if the chat is only 2 people if so delete the whole chat
    if (chat.user_ids.length === 2) {
      await Promise.all(
        chat.messages.map(async (id) => {
          try{
            await this.MessageService.delete(id);
          }catch (err){
            console.error(`Failed to delete message ${id}:`, err.message);
          }
        }
    ));
      await this.chatModel.deleteOne({ _id: chat_id });
      return ;
    }

    // if user is admin of the chat
    if (chat.admin_id === req['user'].userid) {
      // change admin to the next user in the array
      chat.admin_id = chat.user_ids[index + 1];
    }
    // now remove from the user_ids 
    chat.user_ids.splice(index, 1);
    chat.save()
  }
}
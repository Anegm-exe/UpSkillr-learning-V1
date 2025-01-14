import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './model/chat.schema';
import { Model } from 'mongoose'
import { UserService } from '../user/user.service';
import { CreateChatDTO } from './dtos/chat.dto';
import { MessageService } from 'src/message/message.service';
import { Request } from 'express';
import { NotificationService } from 'src/notification/notifications.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    private readonly UserService: UserService,
    private readonly MessageService: MessageService,
    private readonly notificationService: NotificationService

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
      const newChat = await new this.chatModel(createChatDto); //dto for creating a chat
      this.notificationService.create({user_ids:userIds,message:`You have been added to a Chat named ${newChat.name}`})
      return await newChat.save(); // saves to db
    }
    throw new RangeError('Chat should have at least 2 users');
  }

  async findAllChats(User_Id: string) : Promise<Chat[]> {
    const chats = await this.chatModel.find({ user_ids: User_Id }).populate([
      { path: 'messages', populate: [
        { path: 'user_id', select: ['name','profile_picture_url'] },
        { path: 'repliedTo_id', populate: { path: 'user_id', select: ['name','profile_picture_url'] } }
      ]},
      { path: 'user_ids', select: ['name','profile_picture_url'] }
    ]).exec();
    if(!chats) {
      throw new NotFoundException("User has no chats")
    }
    return chats;
  }

  async getChatDetails(chat_id: string) : Promise<Chat> { //byakhod kaman el dto 3ashan yekon feha kol haga
    const chat = await this.chatModel
    .findById({ _id: chat_id })
    .populate([
      { path: 'messages', populate: [
        { path: 'user_id', select: ['name','profile_picture_url'] },
        { path: 'repliedTo_id', populate: { path: 'user_id', select: ['name','profile_picture_url'] } }
      ]},
      { path: 'user_ids', select: ['name','profile_picture_url'] }
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
    await this.notificationService.create({
      user_ids: chat.user_ids.filter(user_id => user_id !== req['user'].userid),
      message: `${req['user'].name} sent a message in ${chat.name}`,
    });
    chat.messages.push(message._id);
    return chat.save();
  }

  // Reply to a message (working in thunderclient)
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
    const repliedToMessage = await this.MessageService.findOne(message_id);
    if(!repliedToMessage) 
      throw new NotFoundException('Message not found');
    // create message
    const message = await this.MessageService.create({
      text: text,
      user_id: req['user'].userid,
      repliedTo_id: message_id
    });

    // notify the replied to user
    await this.notificationService.create({
      user_ids: [repliedToMessage.user_id],
      message: `${req['user'].name} replied to your message in ${chat.name}`
    });
    // notify the others
    await this.notificationService.create({
      user_ids: chat.user_ids.filter(user_id => user_id !== req['user'].userid && user_id !== repliedToMessage.user_id),
      message: `${req['user'].name} sent a message in ${chat.name}`,
    });

    chat.messages.push(message._id);
    return chat.save();
  }
//works in thunder client
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
    await this.chatModel.deleteOne({ _id: chat_id }).exec();
  return { success: true };
  }
//works in thunder client
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

    await this.notificationService.create({
      user_ids: [user_id],
      message: `You have been removed from the chat ${chat.name}`
    });

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
      if (chat.admin_id !== req['user'].userid && req['user'].userid !== message.user_id) {
        throw new UnauthorizedException('You are not authorized to delete this message');
      }

      // remove from message collection
      this.MessageService.delete(message_id);

      // remove from chat messages array
      chat.messages.splice(index, 1);
      
      return; //not working in thunderclient 
  }

  // Leave chat works in thunderclient
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
    // tell the chat member you left
    await this.notificationService.create({
      user_ids: chat.user_ids.filter(id => id !== req['user'].userid),
      message: `${req['user'].username} has left the chat ${chat.name}`
    });
  
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
      await this.chatModel.deleteOne({ _id: chat_id }).exec();
      return;
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
  async searchByName(name: string, req: Request): Promise<Chat[]> {
    return this.chatModel.find({ 
      name: { $regex: name, $options: 'i'}, 
      user_ids : req['user'].userid
    })
    
  }
}
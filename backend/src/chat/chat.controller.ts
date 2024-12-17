import { Controller, Post, Get, Body, Query, Put, Patch, Delete, Param, UseGuards, Res, Req, UseInterceptors } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './model/chat.schema'
import { CreateChatDTO, GetChatDetailsDTO, UpdateChatDTO } from './dtos/chat.dto';
import { Request } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) 
{}
  //creating a chat
  @Post()
  async createChat(@Body('chat') createChatDTO: CreateChatDTO, @Body('emails') email: string[]) {
    return await this.chatService.createChat(createChatDTO, email); //creating 
  }

  //getting all chats based on user_id
  @Get('user/:user_id')
  async getAllChats(@Param('user_id') user_id: string) {
    return await this.chatService.findAllChats(user_id);
  }

  //check for chat details
  /* a get method to get me a chat details by giving it the chat_id*/
  @Get(':chat_id')
  async getChatDetails(@Param('chat_id') chat_id: string) {
    return await this.chatService.getChatDetails(chat_id);
  }

  // send Message
  @Post(':chat_id/send')
  async sendMessage(@Param('chat_id') chat_id: string, @Body('message') message : string, @Req() req: Request) {
    return await this.chatService.sendMessage(chat_id, message, req);
  }

  // reply message
  @Post(':chat_id/reply/:message_id')
  async replyToMessage(@Param('chat_id') chat_id: string,@Param('message_id') message_id: string, @Body('message')
  message : string, @Req() req: Request) {
    return await this.chatService.replyToMessage(chat_id,message_id,message, req);
  }

  @Delete(':chat_id')
  async deleteChat(@Param('chat_id') chat_id: string, @Req() req: Request) {
    return await this.chatService.deleteChat(chat_id, req);
  }

  @Post(':chat_id/user/:email')
  async addUserToChat(
    @Param('chat_id') chat_id: string,
    @Param('email') email: string,
    @Req() req: Request
  ): Promise<Chat> {
    return await this.chatService.addUserToChat(chat_id, email, req);
  }

  @Delete(':chat_id/user/:user_id')
  async removeUserFromChat(
    @Param('chat_id') chat_id: string,
    @Param('user_id') user_id: string,
    @Req() req: Request
    ): Promise<void> {
      await this.chatService.removeUsersFromChat(chat_id, user_id, req);
  }

    // Delete message from chat
    @Delete(':chat_id/message/:message_id')
    async deleteMessageFromChat(
      @Param('chat_id') chat_id: string,
      @Param('message_id') message_id: string,
      @Req() req: Request
      ): Promise<void> {
        await this.chatService.deleteMessageFromChat(chat_id, message_id, req);
    }

  // leave chat
  @Delete(':chat_id/leave')
  async leaveChat(@Param('chat_id') chat_id: string, @Req() req: Request): Promise<void> {
    await this.chatService.leaveChat(chat_id, req);
  }

  // search by name
  @Get('search/:name')
  async searchByName(@Param('name') name: string, @Req() req: Request): Promise<Chat[]> {
    return await this.chatService.searchByName(name, req);
  }
}

/* body decorator binds the request body to the DTO parameter
in order to pass the data from the HTTP request directly to the method
createChatDTO: createChatDTO: passing the type of the incoming data to match
 the structure of createChatDTO class */

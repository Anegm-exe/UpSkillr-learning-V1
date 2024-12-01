import { Controller, Post, Get, Body, Query, Put, Patch, Delete, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from '../schemas/chat.schema'
import { GetChatDetailsDTO } from './chat.dto';
import { plainToInstance } from 'class-transformer';
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post(':id')
  async createChat(@Body('chat') createChatDTO: Partial<Chat>, @Body('emails') email: string[]) {
    return this.chatService.createChat(createChatDTO, email); //creating 
  }

  @Get(':chat_id')
  async getAllChats(@Param('chat_id') chat_id: string) { 
    return this.chatService.findAllChats(chat_id);
  }
  @Get(':chat_id/messages')
  async getChatDetails(@Param('message_id') chat_id: string) {
    const getChatDetailsDto = plainToInstance(GetChatDetailsDTO, { chat_id }) //which, message or chat id??
    return this.chatService.getChatDetails(chat_id); /* a get method to get me a chat details by giving it the chat_id*/
  }
  @Get(':recent')
  async getRecentChat(@Param('chat_id') chat_id: string) {
    return this.chatService.getRecentChat(chat_id);
  }
  @Delete(':chat_id')
  async deleteChat(@Param('chat_id') chat_id: string) {
    return this.chatService.deleteChat(chat_id);
  }

}

/* body decorator binds the request body to the DTO parameter
in order to pass the data from the HTTP request directly to the method
createChatDTO: createChatDTO: passing the type of the incoming data to match
 the structure of createChatDTO class */

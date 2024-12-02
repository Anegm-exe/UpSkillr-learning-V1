import { Controller, Post, Get, Body, Query, Put, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from '../schemas/chat.schema'
import { CreateChatDTO, GetChatDetailsDTO, UpdateChatDTO } from './chat.dto';
import { Role, Roles } from 'src/Auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/Auth/guards/authorization.guard';
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  //creating a chat
  @Post(':id')
  async createChat(@Body('chat') createChatDTO: CreateChatDTO, @Body('emails') email: string[]) {
    return await this.chatService.createChat(createChatDTO, email); //creating 
  }

  //getting all chats based on user_id
  @Get(':user_id')
  async getAllChats(@Param('user_id') user_id: string) {
    return await this.chatService.findAllChats(user_id);
  }

  //check for chat details
  /* a get method to get me a chat details by giving it the chat_id*/
  @Get(':chat_id/messages')
  async getChatDetails(@Param('chat_id') chat_id: string, createChatDTO: CreateChatDTO) {
    return await this.chatService.getChatDetails(chat_id, createChatDTO);
  }


  // deleted a chat (only done by an admin)
  //for when a user registers they should pass through the authorization guard
  @Roles(Role.Admin)
  @UseGuards(authorizationGuard)

  @Delete(':chat_id')
  async deleteChat(@Param('chat_id') chat_id: string) {
    return await this.chatService.deleteChat(chat_id);
  }

  //updating a chat
  @Roles(Role.Admin)
  @UseGuards(authorizationGuard)


  @Patch(':chat_id')
  async updateChat(@Param('chat_id') chat_id: string, @Body() updateChatDTO: UpdateChatDTO) {
    return await this.chatService.updateChat(chat_id, updateChatDTO);
  }
}

/* body decorator binds the request body to the DTO parameter
in order to pass the data from the HTTP request directly to the method
createChatDTO: createChatDTO: passing the type of the incoming data to match
 the structure of createChatDTO class */

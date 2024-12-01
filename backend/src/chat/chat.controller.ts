import { Controller, Post, Get, Body, Query, Put, Patch, Delete, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDTO, CreateMessageDTO, GetAllChatsDTO, GetChatDetailsDTO, GetRecentChatDTO, DeleteMessageDTO, EditMessagesDTO } from './chat.dto';
import { plainToInstance } from 'class-transformer';
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Post()
  async createChat(@Param('User_Id') User_Id: string, @Body() createChatDTO: CreateChatDTO) {
    return this.chatService.createChat(User_Id, createChatDTO); //creating 

  }
  @Post(':chat_id/messages')
  async createMessage(@Body() createMessageDTO: CreateMessageDTO) {
    return this.chatService.createMessage(createMessageDTO);
  }
  @Get(':chat_id')
  async getAllChats(@Param('chat_id') chat_id: string, @Query() getAllChatsDTO: GetAllChatsDTO) {
    return this.chatService.findAllChats(chat_id, getAllChatsDTO);
  }
  @Get(':chat_id/messages')
  async getChatDetails(@Param('message_id') chat_id: string, @Query() getAllChatsDTO: GetAllChatsDTO) {
    const getChatDetailsDto = plainToInstance(GetChatDetailsDTO, { chat_id }) //which, message or chat id??
    return this.chatService.getChatDetails(chat_id, getChatDetailsDto); /* a get method to get me a chat details by giving it the chat_id*/
  }
  @Get(':recent')
  async getRecentChat(@Param('chat_id') chat_id: string, @Query() getRecentChatDto: GetRecentChatDTO) {
    return this.chatService.getRecentChat(chat_id, getRecentChatDto); //i need to sort first descendingly (shaklo ghalat aslan)
  }
  @Delete(':chat_id')
  async deleteChat(@Param('chat_id') chat_id: string) {
    return this.chatService.deleteChat(chat_id);
  }
  @Delete(':chatId/messages/:messageId')
  async deleteMessage(
    @Param('chatId') chatId: string,
    @Param('messageId') messageId: string,
    @Body() deleteMessageDTO: DeleteMessageDTO) {
    // pass `chatId`, `messageId`, and `deleteMessageDTO` to the service layer.
    return this.chatService.deleteMessage(chatId, messageId, deleteMessageDTO);
  }
  @Patch(':chat_id/messages:/message_id')
  async editMessage(@Param('chat_id') chat_id: string, @Param('message_id') message_id: string, @Body() text: string) {
    return this.chatService.editMessage(chat_id, message_id, text);
    /*a patch method to edit messages by taking chat_id and message_id as parameters */
  }
}


/* body decorator binds the request body to the DTO parameter
in order to pass the data from the HTTP request directly to the method
createChatDTO: createChatDTO: passing the type of the incoming data to match
 the structure of createChatDTO class */

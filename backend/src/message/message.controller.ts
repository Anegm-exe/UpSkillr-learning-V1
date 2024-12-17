import { Controller, Get, Post, Delete, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './model/message.schema';
import { CreateMessageDTO, UpdateMessageDTO } from './dtos/message.dto';
import { AuthGuard } from 'src/Auth/guards/authentication.guard';

@UseGuards(AuthGuard)
@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) { }

    
    @Post()
    async create(@Body() createMessageDTO: CreateMessageDTO): Promise<Message> {
        return this.messageService.create(createMessageDTO);
    }
    @Get()
    async findAll(): Promise<Message[]> {
        return this.messageService.findAll();
    }

    //get by id
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Message> {
      return this.messageService.findOne(id);
    }

    //delete a forum
    @Delete(':_id')
    async delete(@Param('_id') _id: string): Promise<void> {
        return this.messageService.delete(_id);
    }
    //     @Patch(':chat_id/messages:/message_id')
    //   async editMessage(@Param('chat_id') chat_id: string, @Param('message_id') message_id: string, @Body() text: string) {
    //     return this.messageService.editMessage(chat_id, message_id, text);

    @Patch(':id')  // PUT /messages/:id
    async updateMessage(
      @Param('id') id: string,           // Path parameter for message ID
      @Body() updateData: UpdateMessageDTO // Request body containing update data
    ): Promise<Message> {
      return this.messageService.update(id, updateData);
    }
}

import { Controller, Get, Post, Delete, Body, Param, Put } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from '../schemas/message.schema';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) { }

    //create a forum
    @Post()
    async createForum(@Body() createMessageDTO: Message): Promise<Message> {
        return this.messageService.create(createMessageDTO);

    }
    //get all forums
    @Get()
    async findAll(): Promise<Message[]> {
        return this.messageService.findAll();
    }

    //delete a forum
    @Delete(':_id')
    async delete(@Param('_id') _id: string): Promise<void> {
        return this.messageService.delete(_id);
    }
    //     @Patch(':chat_id/messages:/message_id')
    //   async editMessage(@Param('chat_id') chat_id: string, @Param('message_id') message_id: string, @Body() text: string) {
    //     return this.messageService.editMessage(chat_id, message_id, text);

    @Put(':id')  // PUT /messages/:id
    async updateMessage(
        @Param('id') id: string,           // Extract ID from route parameter
        @Body() updateData: Partial<Message> // Accept raw object for update data
    ): Promise<Message> {
        return this.messageService.update(id, updateData);
    }
}

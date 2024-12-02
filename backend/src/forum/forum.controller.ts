import { Controller, Get, Post, Delete, Body, Param, Put, UseGuards } from '@nestjs/common';
import { ForumService } from './forum.service';
import { Forum } from '../schemas/forum.schema';
import { Roles } from 'src/Auth/decorators/roles.decorator';
import { Role } from 'src/Auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/Auth/guards/authorization.guard';


@Controller('forum')
export class ForumController {
    constructor(private readonly forumService: ForumService) { }

    //create a forum
    @Post()
    async createForum(@Body() createForumDTO: Forum): Promise<Forum> {
        return this.forumService.create(createForumDTO);
    }

    //get one forum
    @Get(':_id')
    async findOne(@Param('_id') _id: string): Promise<Forum> {
        return this.forumService.findOne(_id);
    }

    //get all forums
    @Get()
    async findAll(): Promise<Forum[]> {
        return this.forumService.findAll();
    }

    @Get(':_id')
    async getByCourse(@Param('_id') _id: string): Promise<Forum[]> {
        return this.forumService.getByCourse(_id);
    }

    @Get(':_id')
    async getByUser(@Param('_id') _id: string): Promise<Forum[]> {
        return this.forumService.getByUser(_id);
    }

    @Put(':_id')
    async update(@Param('_id') _id: string, @Body() updateData: Partial<Forum>): Promise<Forum> {
        return this.forumService.update(_id, updateData);
    }

    @Post(':_id/:messageId')
    async addMessage(@Param('_id') _id: string, @Param('messageId') messageId: string): Promise<void> {
        return this.forumService.addMessage(_id, messageId);
    }

    //add message to forum
    @Delete(':_id')
    async delete(@Param('_id') _id: string): Promise<void> {
        return this.forumService.delete(_id);
    }
    
    //delete a forum
    @Roles(Role.Admin, Role.Instructor)
    @UseGuards(authorizationGuard)
    @Put(':_id')
    async deleteMessage(@Param('_id') _id: string, @Body() message_id: string): Promise<void> {
        return this.forumService.deleteMessage(_id, message_id);
    }


}
//     @Post(':_id/:id')
//     async findOne(@Param('_id') _id: string): Promise<Forum> {
//         Forum newForum = this.forumService.findOne(_id);
//         newForum.messages.push(id);
// }
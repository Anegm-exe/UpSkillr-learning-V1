import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ForumService } from './forum.service';
import { Forum } from '../schemas/forum.schema';

@Controller('forum')
export class ForumController {
    constructor(private readonly forumService: ForumService) { }

    //create a forum
    @Post()
    async createForum(@Body() createForumDTO: Forum): Promise<Forum> {
        return this.forumService.create(createForumDTO);

    }
    //get all forums
    @Get()
    async findAll(): Promise<Forum[]> {
        return this.forumService.findAll();
    }

    //     @Post(':_id/:id')
    //     async findOne(@Param('_id') _id: string): Promise<Forum> {
    //         Forum newForum = this.forumService.findOne(_id);
    //         newForum.messages.push(id);
    // }

    //delete a forum
    @Delete(':_id')
    async delete(@Param('_id') _id: string): Promise<void> {
        return this.forumService.delete(_id);
    }
}

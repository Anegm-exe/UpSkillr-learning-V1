import { Controller, Get, Post, Delete, Body, Param, Req, Patch, UseGuards } from '@nestjs/common';
import { ForumService } from './forum.service';
import { Forum } from './model/forum.schema';
import { CreateForumDto, UpdateForumDto } from './dtos/forum.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/Auth/guards/authentication.guard';
import { Message } from 'src/message/model/message.schema';



@Controller('forum')
export class ForumController {
    constructor(private readonly forumService: ForumService) { }

    //create a forum
    @UseGuards(AuthGuard)
    @Post()
    async createForum(@Body() createForumDTO: CreateForumDto,@Req() req: Request): Promise<Forum> {
        return this.forumService.create(createForumDTO, req);
    }

    //get one forum
    @Get(':forum_id')
    async findOne(@Param('forum_id') forum_id: string): Promise<Forum> {
        return this.forumService.findOne(forum_id);
    }

    //get all forums
    @Get()
    async findAll(): Promise<Forum[]> {
        return this.forumService.findAll();
    }

    @Get('course/:_id')
    async getByCourse(@Param('_id') _id: string): Promise<Forum[]> {
        return this.forumService.getByCourse(_id);
    }

    @Get('user/:_id')
    async getByUser(@Param('_id') _id: string): Promise<Forum[]> {
        return this.forumService.getByUser(_id);
    }
    @Get('forumMsgs/:_id')
    async getMessages(@Param('_id') _id: string): Promise<Message[]> {
        return this.forumService.getForumMessages(_id);
    }

    @UseGuards(AuthGuard)
    @Patch(':forum_id')
    async update(
        @Param('forum_id') forum_id: string,
        @Body() updateData: UpdateForumDto,
        @Req() req: Request
    ) : Promise<Forum> {
        return this.forumService.update(forum_id, updateData,req);
    }

    @UseGuards(AuthGuard)
    @Post(':forum_id')
    async sendMessage(@Param('forum_id') _id: string, @Body('message') message: string, @Req() req: Request) {
        return await this.forumService.sendMessage(_id, message,req);
    }

    @UseGuards(AuthGuard)
    @Post(':forum_id/reply/:message_id')
    async reply(@Param('forum_id') forum_id: string, @Param('message_id') message_id: string, @Body('message') message: string, @Req() req: Request) {
        return await this.forumService.replyToMessage(forum_id, message_id, message, req);
    }

    @UseGuards(AuthGuard)
    @Delete(':forum_id')
    async delete(@Param('forum_id') forum_id: string, @Req() req: Request): Promise<void> {
        return this.forumService.delete(forum_id,req);
    }    

    @UseGuards(AuthGuard)
    @Delete(':forum_id/message/:message_id')
    async deleteMessage(@Param('forum_id') forum_id: string, @Param('message_id') message_id: string, @Req() req: Request): Promise<void> {
        return this.forumService.deleteMessageFromForum(forum_id, message_id,req);
    }

    @Get('search/:title')
    async searchByTitle(@Param('title') title: string): Promise<Forum[]> {
        return this.forumService.searchByTitle(title);
    }
}
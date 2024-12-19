import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forum, ForumDocument } from './model/forum.schema';
import { MessageService } from 'src/message/message.service';
import { CreateForumDto, UpdateForumDto } from './dtos/forum.dto';
import { Request } from 'express';
import { NotificationService } from 'src/notification/notifications.service';
@Injectable()
export class ForumService {
    constructor(@InjectModel(Forum.name) 
        private forumModel: Model<ForumDocument>,
        private readonly messageService: MessageService,
        private readonly notificationService: NotificationService
    ) { }

    async create(forum: CreateForumDto, req: Request): Promise<Forum> {
        forum.user_id = req['user'].userid;
        const newForum = new this.forumModel(forum);
        return newForum.save();
    }

    async findAll(): Promise<Forum[]> {
        return this.forumModel.find().populate([
            { path: 'messages', populate: { path: 'user_id', select: ['name','profile_picture_url'] } },
            { path: 'user_id', select: ['name','profile_picture_url'] } 
        ]).exec();
    }

    async findOne(id: string): Promise<Forum> {
        const forum = await this.forumModel
            .findById({ _id: id })
            .populate([
                { path: 'messages', populate: { path: 'user_id', select: ['name','profile_picture_url'] } },
                { path: 'user_id', select: ['name','profile_picture_url'] } 
            ])
            .exec();
        if (!forum) {
            throw new NotFoundException(`Forum with ID ${id} not found`);
        }
        return forum;
    }

    async update(id: string,updateData: UpdateForumDto, req: Request): Promise<Forum> {
        const forum = await this.forumModel.findOne({ _id: id });
        if(!forum) {
            throw new NotFoundException(`Forum with ID ${id} not found`);
        }
        if(!forum.user_id !== req['user'].userid && req['user'].role === 'student') {
            throw new UnauthorizedException('You are not authorized to update this forum');
        }
        const updatedForum = await this.forumModel
            .findOneAndUpdate({ _id: id }, updateData, { new: true })
            .exec();
        return updatedForum;
    }

    async delete(id: string, req: Request): Promise<void> {
        const forum = await this.forumModel.findOne({ _id: id });
        if(!forum) {
            throw new NotFoundException(`Forum with ID ${id} not found`);
        }
        // check if not same user or student
        if(forum.user_id !== req['user'].userid && req['user'].role === 'student') {
            throw new UnauthorizedException('You are not authorized to delete this forum');
        }
        await Promise.all(
            forum.messages.map(async (messageId) => {
                try {
                    await this.messageService.delete(messageId)
                }catch(err) {
                    console.error(`Failed to delete message ${id}:`, err.message);
                }
            })
        );
        await this.forumModel.deleteOne({ _id: id }).exec();
    }

    async sendMessage(forum_id: string, text: string, req: Request) {
        const forum = await this.forumModel.findById(forum_id);
        if (!forum) {
          throw new NotFoundException('Fourm not found');
        }
        const message = await this.messageService.create({
          text: text,
          user_id: req['user'].userid
        })
        await this.notificationService.create({
            user_ids: [forum.user_id],
            message: `New reply on forum: ${forum.title.slice(0, 30)}...`,
        });  
        forum.messages.push(message._id);
        return forum.save();
    }

    async replyToMessage(forum_id: string, message_id: string, text: string, req: Request) {
        const forum = await this.forumModel.findById(forum_id);
        if (!forum) {
          throw new NotFoundException('Forum not found');
        }

        // is the message in the forum
        if (!forum.messages.includes(message_id)) {
          throw new NotFoundException('Message not found in forum');
        }
        const repliedToMessage = await this.messageService.findOne(message_id)
        if(!repliedToMessage) {
            throw new NotFoundException('Message not found');
        }
        // create message
        const message = await this.messageService.create({
          text: text,
          user_id: req['user'].userid,
          repliedTo_id: message_id
        });
        await this.notificationService.create({
            user_ids: [repliedToMessage.user_id],
            message: `New reply on your message on forum with title ${forum.title.slice(0, 30)}...`
        });
        forum.messages.push(message._id);
        return forum.save();
    }

    async deleteMessageFromForum(forum_id: string, message_id: string, req: Request): Promise<void> {
        // Find the forum by ID
        const forum = await this.forumModel.findById(forum_id);
        if (!forum) {
            throw new NotFoundException('Forum not found');
        }

        // Find message in forum
        const index = forum.messages.indexOf(message_id);
        if (index === -1) {
            throw new NotFoundException('Message not found in this chat');
        }

        // Get the message
        const message = await this.messageService.findOne(message_id);
        if(!message) {
            throw new NotFoundException('Message not found');
        }

        // Check if the requester is the chat admin or the one who sent the message
        if (message.user_id !== req['user'].userid && req['user'].role === 'student') {
            throw new UnauthorizedException('You are not authorized to delete this message');
        }
        // remove from message collection
        this.messageService.deleteAll(message_id);

        // remove from chat messages array
        forum.messages.splice(index, 1);
    }

    async getByCourse(courseId: string): Promise<Forum[]> {
        const forum = await this.forumModel
        .find({ course_id: courseId })
        .populate([
            { path: 'user_id', select: ['name','profile_picture_url'] } 
        ])
        .exec();
    if (!forum) {
        throw new NotFoundException(`Forum with course ID ${courseId} not found`);
    }
    return forum;
    }

    async getByUser(userId: string): Promise<Forum[]> { 
        const forum = await this.forumModel
            .find({ user_id: userId })
            .populate([
                { path: 'user_id', select: ['name','profile_picture_url'] } 
            ])
            .exec();
        if (!forum) {
            throw new NotFoundException(`Forum with user ID ${userId} not found`);
        }
        return forum;
    }

    async searchByTitle(title: string): Promise<Forum[]> {
        return this.forumModel.find({ title: { $regex: title, $options: 'i' } }).populate([
            { path: 'user_id', select: 'name' },
            { path: 'course_id', select: 'title' } 
        ]);
    }
}

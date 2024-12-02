import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forum, ForumDocument } from '../schemas/forum.schema';
import { MessageService } from 'src/message/message.service';
import { Message } from 'src/schemas/message.schema';
@Injectable()
export class ForumService {
    constructor(@InjectModel(
        Forum.name) private forumModel: Model<ForumDocument>,
        private readonly messageService: MessageService
    ) { }

    // Create A forum With Data Provided
    async create(forum: Forum): Promise<Forum> {
        const newForum = new this.forumModel(forum);
        return newForum.save();
    }

    async findAll(): Promise<Forum[]> {
        return this.forumModel.find().exec();
    }

    async findOne(id: string): Promise<Forum> {
        const forum = await this.forumModel.findOne({ _id: id }).exec();
        if (!forum) {
            throw new NotFoundException(`Forum with ID ${id} not found`);
        }
        return forum;
    }

    async update(id: string, updateData: Partial<Forum>): Promise<Forum> {
        const updatedForum = await this.forumModel
            .findOneAndUpdate({ _id: id }, updateData, { new: true })
            .exec();
        if (!updatedForum) {
            throw new NotFoundException(`Forum with ID ${id} not found`);
        }
        return updatedForum;
    }

    async delete(id: string): Promise<void> {
        const forum = await this.forumModel.findOne({ _id: id }).exec();
        await Promise.all(
            forum.messages.map((messageId) => this.messageService.delete(messageId))
        )
        const result = await this.forumModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Forum with ID ${id} not found`);
        }
    }

    async addMessage(id: string, messageId: string): Promise<void> {
        const forum = await this.forumModel.findOne({ _id: id }).exec();
        if (!forum) {
            throw new NotFoundException(`Forum with ID ${id} not found`);
        }
        forum.messages.push(messageId);
        await forum.save();
    }

    async getMessages(id: string): Promise<Message[]> {
        const forum = await this.forumModel.findOne({ _id: id }).exec();
        if (!forum) {
            throw new NotFoundException(`Forum with ID ${id} not found`);
        }
        const messages = await Promise.all(
            forum.messages.map(async (messageId) => {
                return await this.messageService.findOne(messageId);
            })
        )
        return messages;
    }

    async deleteMessage(id: string, messageId: string): Promise<void> {
        const forum = await this.forumModel.findOne({ _id: id }).exec();
        if (!forum) {
            throw new NotFoundException(`Forum with ID ${id} not found`);
        }
        const messageIndex = forum.messages.indexOf(messageId);
        if (!messageIndex) {
            throw new NotFoundException(`Message with ID ${messageId} not found in forum with ID ${id}`);
        }
        forum.messages.splice(messageIndex, 1);
        await forum.save();
        await this.messageService.delete(messageId);
    }

    async getByCourse(courseId: string): Promise<Forum[]> {
        return this.forumModel.find({ course: courseId }).exec();
    }

    async getByUser(userId: string): Promise<Forum[]> { 
        return this.forumModel.find({ user: userId }).exec();
    }
}

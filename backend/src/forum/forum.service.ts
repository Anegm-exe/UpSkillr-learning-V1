import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Forum, ForumDocument } from '../schemas/forum.schema';

@Injectable()
export class ForumService {
    constructor(@InjectModel(Forum.name) private forumModel: Model<ForumDocument>) { }

    // Create A forum With Data Provided
    async create(forum: Forum): Promise<Forum> {
        const newForum = new this.forumModel(forum);
        return newForum.save();
    }

    async findAll(): Promise<Forum[]> {
        return this.forumModel.find().exec();
    }

    async findOne(id: number): Promise<Forum> {
        const forum = await this.forumModel.findOne({ _id: id }).exec();
        if (!forum) {
            throw new NotFoundException(`Forum with ID ${id} not found`);
        }
        return forum;
    }

    async update(id: number, updateData: Partial<Forum>): Promise<Forum> {
        const updatedForum = await this.forumModel
            .findOneAndUpdate({ _id: id }, updateData, { new: true })
            .exec();
        if (!updatedForum) {
            throw new NotFoundException(`Forum with ID ${id} not found`);
        }
        return updatedForum;
    }

    async delete(id: string): Promise<void> {
        const result = await this.forumModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Forum with ID ${id} not found`);
        }
    }
}

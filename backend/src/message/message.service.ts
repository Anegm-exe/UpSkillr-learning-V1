
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './model/message.schema';
import { CreateMessageDTO, UpdateMessageDTO } from './dtos/message.dto';

@Injectable()
export class MessageService {
    constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>) { }

    // Create A message With Data Provided
    async create(message: CreateMessageDTO): Promise<Message> {
        const newMessage = new this.messageModel(message);
        return newMessage.save();
    }

    async findAll(): Promise<Message[]> {
        return this.messageModel.find().exec();
    }
    async finAllByIds(ids: string[]): Promise<Message[]> {
        return this.messageModel.find({ _id: { $in: ids } }).exec();
    }

    async findOne(id: string): Promise<Message> {
        const message = await this.messageModel.findOne({ _id: id }).exec();
        if (!message) {
            throw new NotFoundException(`Message with ID ${id} not found`);
        }
        return message;
    }

    async update(id: string, updateData: UpdateMessageDTO): Promise<Message> {
        const updatedMessage = await this.messageModel
            .findOneAndUpdate({ _id: id }, updateData, { new: true })
            .exec();
        if (!updatedMessage) {
            throw new NotFoundException(`Message with ID ${id} not found`);
        }
        
        return updatedMessage;
    }

    async delete(id: string): Promise<void> {
        const result = await this.messageModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Message with ID ${id} not found`);
        }
    }

    // Delete message and their replies
    async deleteAll(id: string) {
        const message = await this.messageModel.findById({_id:id}).exec();
        if (!message) {
            throw new NotFoundException(`Message with ID ${id} not found`);
        }
        const replies = await this.messageModel.find({repliedTo_id:id})
        await Promise.all(
            replies.map(async (reply) => {
                this.deleteAll(reply._id);
                this.delete(reply._id);
            })
        );
        await this.delete(id);
    }

    // Get message details
    async getMessageDetails(id: string): Promise<Message> {
        const message = await this.messageModel.findById(id).populate(['user_id','repliedTo_id']).exec();
        return message;
    }
}

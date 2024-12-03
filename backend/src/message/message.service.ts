
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';
import { CreateMessageDTO } from './dtos/message.dto';

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

    async findOne(id: string): Promise<Message> {
        const message = await this.messageModel.findOne({ _id: id }).exec();
        if (!message) {
            throw new NotFoundException(`Message with ID ${id} not found`);
        }
        return message;
    }

    async update(id: string, updateData: Partial<Message>): Promise<Message> {
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

    // Get message details
    async getMessageDetails(id: string): Promise<Message> {
        const message = await this.messageModel.findById(id).populate(['user_id','repliedTo_id']).exec();
        return message;
    }
}

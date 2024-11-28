import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionDocument } from '../schemas/question.schema';

@Injectable()
export class QuestionService {
    constructor(@InjectModel(Question.name) private questionModel: Model<QuestionDocument>,) { }

    // Create A Question With The Data Provided
    async create(question: Question): Promise<Question> {
        const newQuestion = new this.questionModel(question);
        return newQuestion.save();
    }

    // Get All Questions Existing
    async findAll(): Promise<Question[]> {
        return this.questionModel.find().exec();
    }

    // Find A Specific Question by ID
    async findOne(id: String): Promise<Question> {
        const question = await this.questionModel.findOne({ _id: id }).exec();
        if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }
        return question;
    }

    // Update A Question Based On New-Data
    async update(id: String, updateData: Partial<Question>): Promise<Question> {
        const updatedQuestion = await this.questionModel
            .findOneAndUpdate({ _id: id }, updateData, { new: true })
            .exec();
        if (!updatedQuestion) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }
        return updatedQuestion;
    }

    // Delete A Question
    async delete(id: String): Promise<void> {
        const result = await this.questionModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }
    }
}
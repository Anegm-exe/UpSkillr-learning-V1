import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Questions, QuestionsDocument as QuestionDocument } from '../schemas/question.schema';

@Injectable()
export class QuestionService {
    constructor(@InjectModel(Questions.name) private questionModel: Model<QuestionDocument>,) { }

    // Create A Question With The Data Provided
    async create(question: Questions): Promise<Questions> {
        const newQuestion = new this.questionModel(question);
        return newQuestion.save();
    }

    // Get All Questions Existing
    async findAll(): Promise<Questions[]> {
        return this.questionModel.find().exec();
    }

    // Find A Specific Question by ID
    async findOne(id: String): Promise<Questions> {
        const question = await this.questionModel.findOne({ _id: id }).exec();
        if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }
        return question;
    }

    // Update A Question Based On New-Data
    async update(id: String, updateData: Partial<Questions>): Promise<Questions> {
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
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from '../schemas/quiz.schema';

@Injectable()
export class QuizService {
    constructor(@InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,) { }

    // Create A Quiz With The Data Provided
    async create(quiz: Partial<Quiz>): Promise<Quiz> {
        const newQuiz = new this.quizModel(quiz);
        return newQuiz.save();
    }

    // Get All Quizs Existing
    async findAll(): Promise<Quiz[]> {
        return this.quizModel.find().exec();
    }

    // Find A Specific Quiz by ID
    async findOne(id: String): Promise<Quiz> {
        const quiz = await this.quizModel.findOne({ _id: id }).exec();
        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }
        return quiz;
    }

    // Update A Quiz Based On New-Data
    async update(id: String, updateData: Partial<Quiz>): Promise<Quiz> {
        const updatedQuiz = await this.quizModel
            .findOneAndUpdate({ _id: id }, updateData, { new: true })
            .exec();
        if (!updatedQuiz) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }
        return updatedQuiz;
    }

    // Delete A Quiz
    async delete(id: String): Promise<void> {
        const result = await this.quizModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }
    }
}
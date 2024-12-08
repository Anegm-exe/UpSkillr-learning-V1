import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Questions, QuestionsDocument as QuestionDocument } from './model/question.schema';
import { CreateQuestionDto, UpdateQuestionDto } from './dtos/question.dto';
import { ModuleModule } from 'src/module/module.module';
import { ModuleService } from 'src/module/module.service';

@Injectable()
export class QuestionService {
    constructor(
        @InjectModel(Questions.name) private questionModel: Model<QuestionDocument>,
    ) { }

    // Create A Question With The Data Provided
    async create(question: CreateQuestionDto): Promise<Questions> {
        const newQuestion = new this.questionModel(question);
        return newQuestion.save();
    }
    // create many
    async createMany(questions: CreateQuestionDto[]): Promise<Questions[]> {
        const newQuestions = await Promise.all(questions.map(async(question) => {
            return new this.questionModel(question);
        }));
        return await Promise.all(newQuestions.map(question => question.save()));
    }

    // Get All Questions Existing
    async findAll(): Promise<Questions[]> {
        return this.questionModel.find().exec();
    }

    // Find A Specific Question by ID
    async findOne(id: string): Promise<Questions> {
        const question = await this.questionModel.findOne({ _id: id }).exec();
        if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }
        return question;
    }

    // Update A Question Based On New-Data
    async update(question_id: string, updateQuestionDto: UpdateQuestionDto): Promise<Questions> {
        const updatedQuestion = await this.questionModel
            .findOneAndUpdate({ _id: question_id }, updateQuestionDto , { new: true })
            .exec();
        if (!updatedQuestion) {
            throw new NotFoundException(`Question with ID ${question_id} not found`);
        }
        return updatedQuestion;
    }

    // Delete A Question
    async delete(id: string): Promise<void> {
        const result = await this.questionModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }
    }
}
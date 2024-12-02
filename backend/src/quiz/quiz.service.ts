import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from '../schemas/quiz.schema';
import { QuestionService } from 'src/question/question.service';
import { CreateQuestionDto } from 'src/question/dtos/question.dto';
import { CreateQuizDto, UpdateQuizDto } from './dtos/quiz.dto';

@Injectable()
export class QuizService {
    constructor(
        @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
        private readonly questionService: QuestionService
    ) { }

    // Create A Quiz With The Data Provided
    async create(questionsDto: CreateQuestionDto[], module_id:string): Promise<Quiz> {
        if(!module_id) {
            throw new BadRequestException("No module_id found");
        }

        const questions = await Promise.all(
            questionsDto.map(async (question) => {
                return (await this.questionService.create(question))._id;
            }
        ));

        const createQuizDto : CreateQuizDto = {
            questions: questions,
            module_id: module_id
        }

        const quiz = new this.quizModel(createQuizDto);
        return quiz.save();
    }

    // Get All Quizs Existing
    async findAll(): Promise<Quiz[]> {
        return this.quizModel.find().exec();
    }

    // Find A Specific Quiz by ID
    async findOne(id: string): Promise<Quiz> {
        const quiz = await this.quizModel.findOne({ _id: id }).exec();
        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }
        return quiz;
    }

    // Update A Quiz Based On New-Data
    async update(id: string, updateData: UpdateQuizDto): Promise<Quiz> {
        await Promise.all(
            updateData.questions.map(async (question) => {
                await this.questionService.update(question.question_id,question.question);
            }
        ));
        const updatedQuiz = await this.quizModel
            .findOneAndUpdate({ _id: id }, updateData, { new: true })
            .exec();
        if (!updatedQuiz) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }
        return updatedQuiz;
    }

    // Delete A Quiz
    async delete(id: string): Promise<void> {
        const quiz = await this.quizModel.findOne({ _id : id });
        if(!quiz) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }
        await Promise.all(
            quiz.questions.map(async (id) => {
                await this.questionService.delete(id);
            })
        );
        const result = await this.quizModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }
    }
}
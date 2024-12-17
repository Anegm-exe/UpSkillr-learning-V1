import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizDocument } from './model/quiz.schema';
import { QuestionService } from 'src/question/question.service';
import { CreateQuizDto, UpdateQuizDto } from './dtos/quiz.dto';

@Injectable()
export class QuizService {
    constructor(
        @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>,
        private readonly questionService: QuestionService,
    ) { }

    // Create A Quiz With The Data Provided
    async create(CreateQuizDto: CreateQuizDto): Promise<Quiz> {
        const quiz = await new this.quizModel(CreateQuizDto);
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
    async update(id: string, UpdateQuizDto:UpdateQuizDto): Promise<Quiz> {
        const updatedQuiz = await this.quizModel
            .findOneAndUpdate({ _id: id }, UpdateQuizDto, { new: true })
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
        const result = await this.quizModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }
    }

    // return answers
    async getAnswers(id: string): Promise<{question_id:string,answer:number}[]> {
        const quiz = await this.quizModel.findOne({ _id: id }).exec();
        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${id} not found`);
        }

        const answers = await Promise.all(
            quiz.questions.map( async (id)=> {
                const question = await this.questionService.findOne(id);
                return {question_id:question._id.toString(),answer:question.answer};
            }
        ))
        return answers;
    }
    // findByUserAndModule
    async findByUserAndModule(user_id: string, module_id: string): Promise<Quiz> {
        const quiz = await this.quizModel.findOne({ user_id:user_id,module_id:module_id }).exec();
        return quiz;
    }

}
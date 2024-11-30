import { Controller, Get, Post, Put, Delete, Body, Param, Patch } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuestionService as QuestionService } from '../question/question.service';
import { Quiz } from '../schemas/quiz.schema';
import { Questions } from 'src/schemas/question.schema';

@Controller('quiz')
export class QuizController {
    constructor(
        private readonly quizService: QuizService,
        private readonly questionService: QuestionService
    ) {}

    @Post()
    async create(
        @Body('quiz') createQuizDto: Quiz, 
        @Body('questions') questionDto: Questions[]
    ): Promise<Quiz> {
        const questions = await Promise.all(
            questionDto.map(async (question) => {
                return (await this.questionService.create(question))._id;
            }
        ));
        createQuizDto.questions = questions;
        try {
            const quiz = this.quizService.create(createQuizDto);
            return quiz;
        }catch(err) {
            await Promise.all(
                questions.map(async (id) => {
                    await this.questionService.delete(id);
                }
            ));            
            throw err;
        }
    }

    @Get()
    async findAll(): Promise<Quiz[]> {
        return this.quizService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: String): Promise<Quiz> {
        return this.quizService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: String,
        @Body('quiz') updateQuizDto: Partial<Quiz>,
        @Body('questions') updateQestionDto: Partial<Questions[]>
    ): Promise<Quiz> {
        await Promise.all(
            updateQestionDto.map(async (question) => {
                await this.questionService.update(question._id,question);
            }
        ));
        return this.quizService.update(id,updateQuizDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: String): Promise<void> {
        const quiz = await this.quizService.findOne(id);
        await Promise.all(
            quiz.questions.map(async (id) => {
                return await this.questionService.delete(id);
            })
        );
        return this.quizService.delete(id);
    }
}
import { Controller, Get, Post, Put, Delete, Body, Param, Patch } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Quiz } from '../schemas/quiz.schema';
import { CreateQuestionDto } from 'src/question/dtos/question.dto';
import { UpdateQuizDto } from './dtos/quiz.dto';

@Controller('quiz')
export class QuizController {
    constructor(
        private readonly quizService: QuizService,
    ) {}

    @Post(':module_id')
    async create(
        @Param('module_id') module_id : string,
        @Body('questions') questionDtos: CreateQuestionDto[]
    ): Promise<Quiz> {
        return await this.quizService.create(questionDtos,module_id);
    }

    @Get()
    async findAll(): Promise<Quiz[]> {
        return this.quizService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Quiz> {
        return this.quizService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body('quiz') updateQuizDto: UpdateQuizDto,
    ): Promise<Quiz> {
        return this.quizService.update(id,updateQuizDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.quizService.delete(id);
    }
}
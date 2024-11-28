import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { QuizService } from '../services/quiz.service';
import { Quiz } from '../schemas/quiz.schema';

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizService: QuizService) { }

    @Post()
    async create(@Body() createQuizDto: Quiz): Promise<Quiz> {
        return this.quizService.create(createQuizDto);
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
        @Body() updateQuizDto: Partial<Quiz>,
    ): Promise<Quiz> {
        return this.quizService.update(id,updateQuizDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: String): Promise<void> {
        return this.quizService.delete(id);
    }
}
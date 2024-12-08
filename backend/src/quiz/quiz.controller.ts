import { Controller, Get, Post, Put, Delete, Body, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Quiz } from './model/quiz.schema';
import { Role, Roles } from 'src/Auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/Auth/guards/authorization.guard';
import { Request } from 'express';
import { CreateQuizDto } from './dtos/quiz.dto';

@Controller('quiz')
export class QuizController {
    constructor(
        private readonly quizService: QuizService,
    ) {}

    @Post()
    async create(
        @Body() CreateQuizDto: CreateQuizDto
    ): Promise<Quiz> {
        return await this.quizService.create(CreateQuizDto);
    }

    @Roles(Role.Admin)
    @UseGuards(authorizationGuard)
    @Get()
    async findAll(): Promise<Quiz[]> {
        return this.quizService.findAll();
    }

    @Roles(Role.Admin,Role.Instructor)
    @UseGuards(authorizationGuard)
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Quiz> {
        return this.quizService.findOne(id);
    }

    @Roles(Role.Admin,Role.Instructor)
    @UseGuards(authorizationGuard)
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.quizService.delete(id);
    }
}
import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Quiz } from './model/quiz.schema';
import { Role, Roles } from 'src/Auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/Auth/guards/authorization.guard';
import { CreateQuizDto } from './dtos/quiz.dto';
import { AuthGuard } from 'src/Auth/guards/authentication.guard';

@UseGuards(AuthGuard)
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
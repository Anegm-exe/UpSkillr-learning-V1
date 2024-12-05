import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { QuestionService as QuestionService } from './question.service';
import { Questions as Question } from '../schemas/question.schema';
import { CreateQuestionDto, UpdateQuestionDto } from './dtos/question.dto';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) { }

    @Post()
    async create(@Body() createQuestionDto: CreateQuestionDto): Promise<Question> {
        return this.questionService.create(createQuestionDto);
    }

    @Get()
    async findAll(): Promise<Question[]> {
        return this.questionService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Question> {
        return this.questionService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateQuestionDto: UpdateQuestionDto,
    ): Promise<Question> {
        return this.questionService.update(id,updateQuestionDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.questionService.delete(id);
    
    }
}
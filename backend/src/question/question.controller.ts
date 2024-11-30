import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { QuestionService as QuestionService } from './question.service';
import { Questions as Question } from '../schemas/question.schema';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) { }

    @Post()
    async create(@Body() createQuestionDto: Question): Promise<Question> {
        return this.questionService.create(createQuestionDto);
    }

    @Get()
    async findAll(): Promise<Question[]> {
        return this.questionService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: String): Promise<Question> {
        return this.questionService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: String,
        @Body() updateQuestionDto: Partial<Question>,
    ): Promise<Question> {
        return this.questionService.update(id,updateQuestionDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: String): Promise<void> {
        return this.questionService.delete(id);
    
    }
}
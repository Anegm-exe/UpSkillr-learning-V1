import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ResponseService } from './response.service';
import { Response } from '../schemas/response.schema';
import { QuestionService } from 'src/question/question.service';

@Controller('response')
export class ResponseController {
    constructor(
        private readonly responseService: ResponseService,
        private readonly qustionsService : QuestionService
    ) { }

    @Post()
    async create(@Body() createResponseDto: Response): Promise<Response> {
        const quiz = await this.responseService.create(createResponseDto);
        console.log(quiz);
        let score = 0;
        for (const answerResponse of createResponseDto.answers) {
            const question = await this.qustionsService.findOne(answerResponse.questionId);
            if (question.answer === answerResponse.answer) {
                score++;
            }
        }
        createResponseDto.score = score;
        return await this.responseService.update(quiz._id,createResponseDto)
    }


    @Get()
    async findAll(): Promise<Response[]> {
        return this.responseService.findAll();
    }

    @Get('quiz/:id')
    async findAllByQuizId(@Param('id') id: String): Promise<Response[]> {
        return this.responseService.findAllByQuizId(id);
    } 

    @Get('user/:id')
    async findAllByUserId(@Param('id') id: String): Promise<Response[]> {
        return this.responseService.findAllByUserId(id);
    } 

    @Get(':id')
    async findOne(@Param('id') id: String): Promise<Response> {
        return this.responseService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: String,
        @Body() updateResponseDto: Partial<Response>,
    ): Promise<Response> {
        return this.responseService.update(id,updateResponseDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: String): Promise<void> {
        return this.responseService.delete(id);
    }
}
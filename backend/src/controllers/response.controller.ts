import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ResponseService } from '../services/response.service';
import { Response } from '../schemas/response.schema';

@Controller('response')
export class ResponseController {
    constructor(private readonly responseService: ResponseService) { }

    @Post()
    async create(@Body() createResponseDto: Response): Promise<Response> {
        return this.responseService.create(createResponseDto);
    }

    @Get()
    async findAll(): Promise<Response[]> {
        return this.responseService.findAll();
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
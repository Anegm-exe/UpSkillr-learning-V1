import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { Progress } from '../schemas/progress.schema';
import { CreateProgressDto, UpdateProgressDto } from './dtos/progress.dto';

@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) { }

    @Post()
    async create(@Body() createProgressDto: CreateProgressDto): Promise<Progress> {
        return this.progressService.create(createProgressDto);
    }

    @Get()
    async findAll(): Promise<Progress[]> {
        return this.progressService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Progress> {
        return this.progressService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateProgressDto: UpdateProgressDto,
    ): Promise<Progress> {
        return this.progressService.update(id,updateProgressDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.progressService.delete(id);
    }
}
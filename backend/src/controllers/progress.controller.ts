import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProgressService } from '../services/progress.service';
import { Progress } from '../schemas/progress.schema';

@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) { }

    @Post()
    async create(@Body() createProgressDto: Progress): Promise<Progress> {
        return this.progressService.create(createProgressDto);
    }

    @Get()
    async findAll(): Promise<Progress[]> {
        return this.progressService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: String): Promise<Progress> {
        return this.progressService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: String,
        @Body() updateProgressDto: Partial<Progress>,
    ): Promise<Progress> {
        return this.progressService.update(id,updateProgressDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: String): Promise<void> {
        return this.progressService.delete(id);
    }
}
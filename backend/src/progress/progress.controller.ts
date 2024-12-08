import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { Progress } from './model/progress.schema';
import { CreateProgressDto, UpdateProgressDto } from './dtos/progress.dto';
import { Role, Roles } from 'src/Auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/Auth/guards/authorization.guard';

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
    // find progress by user
    @Get('user/:id')
    async findProgressByUser(@Param('id') id: string): Promise<Progress[]> {
        return this.progressService.findProgressByUser(id);
    }

    @Get('course/:courseId/user/:userId/')
    async findProgressByUserAndCourse(@Param('courseId') courseId: string, @Param('userId') userId: string): Promise<Progress> {
        return this.progressService.findByUserAndCourse(userId,courseId);
    }

    // see all course progress
    @Roles(Role.Admin,Role.Instructor)
    @UseGuards(authorizationGuard)
    @Get('course/:courseId')
    async findProgressByCourse(@Param('courseId') courseId: string): Promise<Progress[]> {
        return this.progressService.findByCourse(courseId);
    }
}
import { Controller, Get, Delete, Body, Param, UseGuards, Req, Patch } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from './model/user.schema';
import { Role, Roles } from 'src/Auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/Auth/guards/authorization.guard';
import { updateUserDto, UserDto } from './dtos/user.dto';
import { Request } from 'express';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Roles(Role.Admin)
    @UseGuards(authorizationGuard)
    @Get()
    async findAll(): Promise<UserDto[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: Request): Promise<User> {
        return this.userService.findOne(id,req);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: updateUserDto,
        @Req() req: Request
    ): Promise<User> {
        return this.userService.update(id, updateUserDto, req);
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Req() req: Request): Promise<void> {
        return this.userService.delete(id,req);
    }

    @Get('students/course/:courseId')
    async findStudentsByCourse(@Param('courseId') courseId: string): Promise<UserDto[]> {
        return await this.userService.getStudentsInCourse(courseId);
    }

    @Get('instructor/course/:courseId')
    async findInstructorByCourse(@Param('courseId') courseId: string): Promise<UserDto[]> {
        return await this.userService.getInstructorsInCourse(courseId)
    }

    @Get('search/:name')
    async searchByName(@Param('name') name: string): Promise<UserDto[]> {
        return await this.userService.searchByName(name)
    }

}

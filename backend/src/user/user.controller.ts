import { Controller, Get, Post, Put, Delete, Body, Param, BadRequestException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../schemas/user.schema';
import { Role, Roles } from 'src/Auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/Auth/guards/authorization.guard';
import { updateUserDto } from './dtos/user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Roles(Role.Admin)
    @UseGuards(authorizationGuard)
    @Get()
    async findAll(): Promise<User[]> {
        return this.userService.findAll();
    }


    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        return this.userService.findOne(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: updateUserDto,
    ): Promise<User> {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.userService.delete(id);
    }
}

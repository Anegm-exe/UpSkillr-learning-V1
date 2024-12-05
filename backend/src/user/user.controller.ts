import { Controller, Get, Post, Put, Delete, Body, Param, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }
    // All Single Supporting Funcs (Main Single Service Ones)
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
        @Body() updateUserDto: Partial<User>,
    ): Promise<User> {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.userService.delete(id);
    }
}

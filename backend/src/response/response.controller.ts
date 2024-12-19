import { Controller, Get, Post, Delete, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { ResponseService } from './response.service';
import { Response } from './model/response.schema';
import { Role, Roles } from 'src/Auth/decorators/roles.decorator';
import { authorizationGuard } from 'src/Auth/guards/authorization.guard';
import { CreateResponseDto, UpdatedResponseDto } from './dtos/response.dto';
import { AuthGuard } from 'src/Auth/guards/authentication.guard';

@UseGuards(AuthGuard)
@Controller('response')
export class ResponseController {
    constructor(
        private readonly responseService: ResponseService,
    ) { }

    @Roles(Role.Student)
    @UseGuards(authorizationGuard)
    @Post()
    async create(@Body() createResponseDto: CreateResponseDto): Promise<Response> {
        return this.responseService.create(createResponseDto)
    }

    @Get()
    async findAll(): Promise<Response[]> {
        return this.responseService.findAll();
    }

    @Get('quiz/:id')
    async findAllByQuizId(@Param('id') id: string): Promise<Response[]> {
        return this.responseService.findAllByQuizId(id);
    } 

    @Get('user/:id')
    async findAllByUserId(@Param('id') id: string): Promise<Response[]> {
        return this.responseService.findAllByUserId(id);
    } 

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Response> {
        return this.responseService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateResponseDto: UpdatedResponseDto,
    ): Promise<Response> {
        return this.responseService.update(id,updateResponseDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.responseService.delete(id);
    }
}

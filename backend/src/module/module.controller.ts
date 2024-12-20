import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { Modules } from "./model/module.schema";
import { ModuleService } from "./module.service";
import { CreateModuleDto, UpdateModuleDto } from "./dtos/module.dto";
import { Role, Roles } from "src/Auth/decorators/roles.decorator";
import { authorizationGuard } from "src/Auth/guards/authorization.guard";
import { CreateQuestionDto } from "src/question/dtos/question.dto";
import { AuthGuard } from "src/Auth/guards/authentication.guard";
import { Request } from "express";

@UseGuards(AuthGuard)
@Controller('module')
export class ModuleController {
    constructor(private readonly moduleService: ModuleService) {}

    // Create the module
    @Roles(Role.Instructor,Role.Admin)
    @UseGuards(authorizationGuard)
    @Post('course/add/:course_id')
    async create(
        @Param('course_id') course_id: string,
        @Body() createModuleDto: CreateModuleDto): Promise<Modules> {
        return this.moduleService.create(createModuleDto,course_id);
    }

    // rate the module
    @Patch(':module_id/rate/:rating')
    async rateModule(@Param('module_id') module_id: string, @Param('rating') rating: number): Promise<Modules> {
        return this.moduleService.rateModule(module_id, rating);
    }
    // Get all modules by course
    @Get('course/:course_id')
    async findAllByCourse(@Param('course_id') course_id:string, @Req() req: Request): Promise<Modules[]> {
        return await this.moduleService.findAllByCourse(course_id,req);
    }

    // Get all modules 
    @Roles(Role.Admin)
    @UseGuards(authorizationGuard)
    @Get()
    async findAll(): Promise<Modules[]> {
        return await this.moduleService.findAll();
    }

    @Roles(Role.Instructor)
    @UseGuards(authorizationGuard)
    @Post(':module_id/add-questions')
    async addQuestion(@Param('module_id') moduleId: string, @Body() questionDto:CreateQuestionDto[]): Promise<Modules> {
        return this.moduleService.addQuestion(moduleId, questionDto);
    }
    
    @Roles(Role.Instructor)
    @UseGuards(authorizationGuard)
    @Post(':module_id/remove-questions/:question_id')
    async deleteQuestion(@Param('module_id') moduleId: string,@Param('question_id') question_id:string): Promise<Modules> {
        return this.moduleService.deleteQuestion(moduleId,question_id );
    }

    // Update the module
    @Roles(Role.Admin,Role.Instructor)
    @UseGuards(authorizationGuard)
    @Patch(':moduleId')
    async update(
        @Param('moduleId') moduleId: string,
        @Body() updateModuleDto: UpdateModuleDto
    ): Promise<Modules> {
        return this.moduleService.updateModule(moduleId, updateModuleDto);
    }

    // Delete the module
    @Roles(Role.Admin,Role.Instructor)
    @UseGuards(authorizationGuard)
    @Delete(':moduleId')
    async delete(
        @Param('moduleId') moduleId: string
    ): Promise<void> {
            return this.moduleService.delete(moduleId);
    }

    // Find a module by id
    @Roles(Role.Admin)
    @UseGuards(authorizationGuard)
    @Get(':moduleId')
    async findOne(@Param('moduleId') moduleId: string): Promise<Modules> {
        return this.moduleService.findOne(moduleId);
    }
}
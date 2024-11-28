import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { Module } from "../schemas/module.schema";
import { ModuleService } from "src/services/module.service";

@Controller('module')
export class ModuleController {
    constructor(private readonly moduleService: ModuleService) {}

    // Create the module
    @Post()
    async createModule(
        @Body() createModuleDto: Module): Promise<Module> {
        return this.moduleService.createModule(createModuleDto);
    }

    // Update the module
    @Patch(':moduleId')
    async updateModule(
        @Param('moduleId') moduleId: String,
        @Body() updateModuleDto: Partial<Module>,
    ): Promise<Module> {
        return this.moduleService.updateModule(moduleId, updateModuleDto);
    }

    // Delete the module
    @Delete(':moduleId')
    async deleteModule(
        @Param('moduleId') moduleId: String
    ): Promise<void> {
            return this.moduleService.deleteModule(moduleId);
    }

    // Find a module by id
    @Get(':moduleId')
    async findModuleById(@Param('moduleId') moduleId: string): Promise<Module> {
        return this.moduleService.findModuleById(moduleId);
    }
}
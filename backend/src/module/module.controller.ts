import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { module } from "../schemas/module.schema";
import { ModuleService } from "src/module/module.service";

@Controller('module')
export class ModuleController {
    constructor(private readonly moduleService: ModuleService) {}

    // Create the module
    @Post()
    async createModule(
        @Body() createModuleDto: module): Promise<module> {
        return this.moduleService.createModule(createModuleDto);
    }

    // Update the module
    @Patch(':moduleId')
    async updateModule(
        @Param('moduleId') moduleId: String,
        @Body() updateModuleDto: Partial<module>,
    ): Promise<module> {
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
    async findModuleById(@Param('moduleId') moduleId: string): Promise<module> {
        return this.moduleService.findModuleById(moduleId);
    }
}
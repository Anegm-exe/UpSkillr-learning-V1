import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { Modules } from "../schemas/module.schema";
import { ModuleService } from "./module.service";

@Controller('module')
export class ModuleController {
    constructor(private readonly moduleService: ModuleService) {}

    // Create the module
    @Post()
    async createModule(
        @Body() createModuleDto: Modules): Promise<Modules> {
        return this.moduleService.createModule(createModuleDto);
    }

    // Update the module
    @Patch(':moduleId')
    async updateModule(
        @Param('moduleId') moduleId: String,
        @Body() updateModuleDto: Partial<Modules>,
    ): Promise<Modules> {
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
    async findOne(@Param('moduleId') moduleId: string): Promise<Modules> {
        return this.moduleService.findOne(moduleId);
    }
}
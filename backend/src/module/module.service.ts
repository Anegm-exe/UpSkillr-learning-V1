import { Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Modules } from "src/schemas/module.schema";

@Injectable()
export class ModuleService {
    constructor(
        @InjectModel(Modules.name) private moduleModel: Model<Modules>, 
    ) {}

    // Create a new module
    async createModule(createModuleDto: Modules): Promise<Modules> {
        const newModule = new this.moduleModel(createModuleDto);
        return newModule.save();
    }
        
    // Update the module
    async updateModule(moduleId: String, updateModuleDto: Partial<Modules>): Promise<Modules> {
        const updatedModule = await this.moduleModel
            .findByIdAndUpdate(moduleId, updateModuleDto, { new: true })
            .exec();
        if (!updatedModule) {
            throw new NotFoundException(`Module with ID ${moduleId} not found`);
        }
        return updatedModule;
    }

    // Delete a module
    async deleteModule(moduleId: String): Promise<void> {
        const deletedModule = await this.moduleModel.findByIdAndDelete({ _id: moduleId}).exec();
        if (!deletedModule) {
            throw new NotFoundException(`Module with ID ${moduleId} not found`);
        }
    }

    // Find module by id
    async findModuleById(moduleId: String): Promise<Modules> {
        const Module = await this.moduleModel.findById({ _id: moduleId}).exec();
        if (!Module) {
            throw new NotFoundException(`Module with ID ${moduleId} not found`);
        }
        return Module
    }

}
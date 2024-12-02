import { Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { module } from "src/schemas/module.schema";

@Injectable()
export class ModuleService {
    constructor(
        @InjectModel(module.name) private moduleModel: Model<module>, 
    ) {}

    // Create a new module
    async createModule(createModuleDto: module): Promise<module> {
        const newModule = new this.moduleModel(createModuleDto);
        return newModule.save();
    }
        
    // Update the module
    async updateModule(moduleId: String, updateModuleDto: Partial<module>): Promise<module> {
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
    async findModuleById(moduleId: String): Promise<module> {
        const module = await this.moduleModel.findById({ _id: moduleId}).exec();
        if (!module) {
            throw new NotFoundException(`Module with ID ${moduleId} not found`);
        }
        return module
    }

}
import { Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ModuleDocument, Modules } from "../schemas/module.schema";

@Injectable()
export class ModuleService {
    constructor(
        @InjectModel(Modules.name) private moduleModel: Model<ModuleDocument>, 
    ) {}

    // Create a new module
    async createModule(CreateModuleDto: Modules): Promise<Modules> {
        const newModule = new this.moduleModel(CreateModuleDto);
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
    async findOne(moduleId: String): Promise<Modules> {
        const Module = await this.moduleModel.findOne({ _id: moduleId }).exec();
        if (!Module) {
            throw new NotFoundException(`Module with ID ${moduleId} not found`);
        }
        return Module
    }

}
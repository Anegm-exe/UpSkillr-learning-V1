import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from '../schemas/progress.schema';
import { CreateProgressDto, UpdateProgressDto } from './dtos/progress.dto';

@Injectable()
export class ProgressService {
    constructor(@InjectModel(Progress.name) private progressModel: Model<ProgressDocument>,) { }

    // Create A Progress With The Data Provided
    async create(progress: CreateProgressDto): Promise<Progress> {
        const newProgress = new this.progressModel(progress);
        return newProgress.save();
    }

    // Get All Progresss Existing
    async findAll(): Promise<Progress[]> {
        return this.progressModel.find().exec();
    }

    // Find A Specific Progress by ID
    async findOne(id: string): Promise<Progress> {
        const progress = await this.progressModel.findOne({ _id: id }).exec();
        if (!progress) {
            throw new NotFoundException(`Progress with ID ${id} not found`);
        }
        return progress;
    }

    // Update A Progress Based On New-Data
    async update(id: string, updateData: UpdateProgressDto): Promise<Progress> {
        const updatedProgress = await this.progressModel
            .findOneAndUpdate({ _id: id }, updateData, { new: true })
            .exec();
        if (!updatedProgress) {
            throw new NotFoundException(`Progress with ID ${id} not found`);
        }
        return updatedProgress;
    }

    // Delete A Progress
    async delete(id: string): Promise<void> {
        const result = await this.progressModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Progress with ID ${id} not found`);
        }
    }
}
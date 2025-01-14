import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from './model/progress.schema';
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

    // find progress by user
    async findProgressByUser(userId: string): Promise<Progress[]> {
        return this.progressModel.find({ user_id:userId }).populate([{ path: 'course_id', select:['title']}]).exec();
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

    // Find by user and course
    async findByUserAndCourse(userId: string, courseId: string): Promise<Progress> {
        return this.progressModel.findOne({ user_id:userId, course_id:courseId })
        .populate([
            { path: 'course_id', select:['title']},
            { path: 'user_id', select:['name']}
        ]).exec();
    }

    // find by course
    async findByCourse(courseId: string): Promise<Progress[]> {
        return this.progressModel.find({ course_id: courseId }).exec();
    }

    async isCourseCompletedByUser(course_id:string,user_id:string) : Promise<Boolean> {
        const progress = await this.progressModel.findOne({course_id:course_id,user_id:user_id});
        if(progress.completion_percentage === 100) {
            return true;
        }
        return false;
    }
    async findProgressesByCourse(courseId:string) : Promise<Progress[]> {
        return this.progressModel.find({course_id:courseId}).exec();
    }

    async getFinishedStudentsCount(course_id: string): Promise<number>
    {
        const progresses = await this.findByCourse(course_id);
        let count = 0;
        progresses.forEach(progress => {
            if(progress.completion_percentage === 100) {
                count++;
            }
        })
        return count;
    }
    async averageScoreCourse(course_id:string) {
        const progresses = await this.findByCourse(course_id);
        let sum = 0.0;
        progresses.forEach(progress => {
            sum += progress.average_quiz;
        })
        const average = sum / progresses.length;
        return average;
    }
}
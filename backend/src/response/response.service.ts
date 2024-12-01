import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response, ResponseDocument } from '../schemas/response.schema';

@Injectable()
export class ResponseService {
    constructor(@InjectModel(Response.name) private responseModel: Model<ResponseDocument>,) { }

    // Create A Response With The Data Provided
    async create(response: Response): Promise<Response> {
        const newResponse = new this.responseModel(response);
        return newResponse.save();
    }

    // Get All Responses Existing
    async findAll(): Promise<Response[]> {
        return this.responseModel.find().exec();
    }

    async findAllByQuizId(id: string): Promise<Response[]> {
        const response = await this.responseModel.find({quiz_id : id}).exec()
        if(!response) {
            throw new NotFoundException(`Responses with quiz_id ${id} not found`)
        }
        return response;
    }

    async findAllByUserId(id: string): Promise<Response[]> {
        const response = await this.responseModel.find({user_id : id}).exec()
        if(!response) {
            throw new NotFoundException(`Responses with user_id ${id} not found`)
        }
        return response;
    }


    // Find A Specific Response by ID
    async findOne(id: string): Promise<Response> {
        const response = await this.responseModel.findOne({ _id: id }).exec();
        if (!response) {
            throw new NotFoundException(`Response with ID ${id} not found`);
        }
        return response;
    }

    // Update A Response Based On New-Data
    async update(id: string, updateData: Partial<Response>): Promise<Response> {
        const updatedResponse = await this.responseModel
            .findOneAndUpdate({ _id: id }, updateData, { new: true })
            .exec();
        if (!updatedResponse) {
            throw new NotFoundException(`Response with ID ${id} not found`);
        }
        return updatedResponse;
    }

    // Delete A Response
    async delete(id: string): Promise<void> {
        const result = await this.responseModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Response with ID ${id} not found`);
        }
    }
}
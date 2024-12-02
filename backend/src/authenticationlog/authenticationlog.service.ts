import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthenticationLog, AuthenticationLogDocument } from '../schemas/authenticationlog.schema';
import { CreateAuthenticationLogDto, UpdateAuthenticationLogDto } from './dtos/authenticationlog.dto';
import { createObjectCsvStringifier } from 'csv-writer';

@Injectable()
export class AuthenticationLogService {
    constructor(@InjectModel(AuthenticationLog.name) private authenticationlogModel: Model<AuthenticationLogDocument>,) { }

    // Create A AuthenticationLog With The Data Provided
    async create(authenticationlog: CreateAuthenticationLogDto): Promise<AuthenticationLog> {
        const newAuthenticationLog = new this.authenticationlogModel(authenticationlog);
        return newAuthenticationLog.save();
    }

    // Get All AuthenticationLogs Existing
    async findAll(): Promise<AuthenticationLog[]> {
        return this.authenticationlogModel.find().exec();
    }

    // Find A Specific AuthenticationLog by ID
    async findOne(id: string): Promise<AuthenticationLog> {
        const authenticationlog = await this.authenticationlogModel.findOne({ _id: id }).exec();
        if (!authenticationlog) {
            throw new NotFoundException(`AuthenticationLog with ID ${id} not found`);
        }
        return authenticationlog;
    }

    // Update A AuthenticationLog Based On New-Data
    async update(id: string, updateData: UpdateAuthenticationLogDto): Promise<AuthenticationLog> {
        const updatedAuthenticationLog = await this.authenticationlogModel
            .findOneAndUpdate({ _id: id }, updateData, { new: true })
            .exec();
        if (!updatedAuthenticationLog) {
            throw new NotFoundException(`AuthenticationLog with ID ${id} not found`);
        }
        return updatedAuthenticationLog;
    }

    // Delete A AuthenticationLog
    async delete(id: string): Promise<void> {
        const result = await this.authenticationlogModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`AuthenticationLog with ID ${id} not found`);
        }
    }

    async exportLogsToCsv(): Promise<string> {
        // Step 1: Fetch all logs
        const logs = await this.authenticationlogModel.find().lean();
    
        // Step 2: Define the CSV writer
        const csvStringifier = createObjectCsvStringifier({
          header: [
            { id: '_id', title: 'ID' },
            { id: 'user_id', title: 'User ID' },
            { id: 'event', title: 'Event' },
            { id: 'timestamp', title: 'Timestamp' },
            { id: 'status', title: 'Status' },
          ],
        });
    
        // Step 3: Generate the CSV content
        const csvHeader = csvStringifier.getHeaderString();
        const csvBody = csvStringifier.stringifyRecords(logs);
    
        // Step 4: Return the complete CSV string
        return csvHeader + csvBody;
      }

}
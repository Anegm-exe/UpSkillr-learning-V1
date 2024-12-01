import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,) { }

    // Create A User With The Data Provided
    async create(user: Partial<User>): Promise<User> {
        const newUser = new this.userModel(user);
        return newUser.save();
    }

    // Get All Users Existing
    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    // Find A Specific User by ID
    async findOne(id: string): Promise<User> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid ID format');
        }

        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    // Find Specific User By Email
    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({ email:email }).exec();
    }

    // Update A User Based On New-Data
    async update(id: string, updateData: Partial<User>): Promise<User> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid ID format');
        }

        const updatedUser = await this.userModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();

        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return updatedUser;
    }

    // Delete A User
    async delete(id: string): Promise<void> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid ID format');
        }

        const result = await this.userModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }
}

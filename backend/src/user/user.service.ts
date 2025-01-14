import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./model/user.schema";
import { CreateUserDto, updateUserDto, UserDto } from "./dtos/user.dto";
import { CourseService } from "src/course/course.service";
import { Request } from "express";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, 
  private readonly courseService: CourseService
) {}

  // Create A User With The Data Provided
  async create(user: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  // Get All Users Existing
  async findAll(): Promise<UserDto[]> {
    return this.userModel.find().exec();
  }

  // Find A Specific User by ID
  async findOne(id: string, req: Request): Promise<User> {
    if (req["user"].userid !== id && req["user"].role === "student") {
      throw new UnauthorizedException("You are not authorized to perform this action");
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Find Specific User By Email
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email }).exec();
  }

  // Update A User Based On New-Data
  async update(id: string, updateData: updateUserDto, req: Request): Promise<User> {
    if (req["user"].userid !== id && req["user"].role === "student") {
      throw new UnauthorizedException("You are not authorized to perform this action");
    }
    const updatedUser = await this.userModel.findByIdAndUpdate({ _id: id }, updateData, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  // Delete A User
  async delete(id: string, req: Request): Promise<void> {
    if (req["user"].userid !== id && req["user"].role !== "admin") {
      throw new UnauthorizedException("You are not authorized to perform this action");
    }
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  // search student by name
  async searchStudentByName(name: string): Promise<UserDto[]> {
    const users = await this.userModel.find({ name: { $regex: name, $options: "i" },role: 'student'}).exec();
    return users;
  }

  // search instructor by name
  async searchInstructorByName(name: string): Promise<UserDto[]> {
    const users = await this.userModel.find({ name: { $regex: name, $options: "i" }, role: 'instructor'}).exec();
    return users;
  }

  
  // get Instructors in course
  async getInstructorsInCourse(courseId: string): Promise<UserDto[]> {
    const course = await this.courseService.findOne(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    const users = await Promise.all(
      course.instructor_ids.map(async (instructorId) => {
        const user = await this.userModel.findById({ _id: instructorId }).exec();
        return new UserDto(user);
      })
    );
    return users;
  }

  // get Students in course
  async getStudentsInCourse(courseId: string): Promise<UserDto[]> {
    const course = await this.courseService.findOne(courseId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    const users = await Promise.all(
      course.students.map(async (studentId) => {
        const user = await this.userModel.findById({ _id: studentId }).exec();
        return new UserDto(user);
      })
    );

    return users;
  }
  async getMyDetails(request: Request): Promise<UserDto> {
    const userId = request["user"].userid;
    const user = await this.userModel.findById({ _id: userId }).exec();
    return new UserDto(user);
  }

  // rate instructor
  async rateInstructor(indtructor_id:string,rating: number): Promise<void> {
    const instructor = await this.userModel.findById({ _id: indtructor_id }).exec();
    if(!instructor) {
      throw new NotFoundException(`Instructor with ID ${indtructor_id} not found`);
    }
    await this.userModel.findByIdAndUpdate({_id:indtructor_id},{$push:{ratings:rating}},{new:true});
  }
  
  // get rating average
  async getRatingAverage(indtructor_id:string): Promise<number> {
    const instructor = await this.userModel.findById({ _id: indtructor_id }).exec();
    if(!instructor) {
      throw new NotFoundException(`Instructor with ID ${indtructor_id} not found`);
    }
    if(instructor.ratings.length === 0) {
      return 0;
    }
    const ratings = instructor.ratings;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return sum / ratings.length;
  }

  // export instructor analytics
  async exportInstructorAnalytics(req:Request): Promise<string> {
    return this.courseService.exportAnalytics(req,await this.getRatingAverage(req['user'].userid));
  }
    
}

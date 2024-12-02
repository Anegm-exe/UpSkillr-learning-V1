import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {Course, CourseDocument} from '../schemas/course.schema';

@Injectable()
export class CourseService{
    constructor(@InjectModel(Course.name) private courseModel: Model<CourseDocument>,) { }

    // create a new course
    async create(course: Course): Promise<Course> {
        const newCourse = new this.courseModel(course);
        return newCourse.save();
    }

    // get all courses
    async findAll(): Promise<Course[]> {
        return this.courseModel.find().exec();
    }

    // find a course by id
    async findOne(id: String): Promise<Course> {
        const course = await this.courseModel.findOne({ _id: id }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
    }

    // update a course
    async update(id: String, updateData: Partial<Course>): Promise<Course> {
        const updatedCourse = await this.courseModel
            .findOneAndUpdate({ _id: id },updateData, { new: true })
            .exec();
        if (!updatedCourse) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
        return updatedCourse;
    }    

    // delete a course
    async delete(id: String): Promise<void> {
        const result = await this.courseModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
    }

    // get course by name
    async findByName(name: String): Promise<Course> {
        const course = await this.courseModel.findOne({ title: name }).exec();
        if (!course) {
            throw new NotFoundException(`Course with name ${name} not found`);
        }
        return course;
    }

    // get all instructors for a course
    async getInstructors(courseId: String): Promise<String[]> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        return course.instructor_ids;
    }

    // get all students for a course (Prof only)
    //need to add check for current user role- wait on negm
    async getStudents(courseId: String): Promise<String[]> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        return course.students;
    }

    // get all modules for a course
    async getModules(courseId: String): Promise<String[]> {
    const course = await this.courseModel.findOne({ _id: courseId }).exec();
    if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
    }
    return course.modules;
    }


    //get a specific student in a course  by ID (Prof only)
    //need to add check for current user role- wait on negm
    async getStudent(courseId: String, studentId: String): Promise<String> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        if (!course.students.includes(studentId)) {
            throw new NotFoundException(`Student with ID ${studentId} not found in course with ID ${courseId}`);
        }
        return studentId;
    }

    // get a specific student in a course by name (Prof only)
    //need to add check for current user role- wait on negm
    // dont think this works need to test first (WIP)
    async getStudentByName(courseId: String, studentName: String): Promise<String> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        const student = await this.courseModel.findOne({ title: studentName }).exec();
        if (!student) {
            throw new NotFoundException(`Student with name ${studentName} not found in course with ID ${courseId}`);
        }
        return studentName;
    }

    // get a specific instructor in a course
    async getInstructor(courseId: String, instructorId: String): Promise<String> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        if (!course.instructor_ids.includes(instructorId)) {
            throw new NotFoundException(`Instructor with ID ${instructorId} not found in course with ID ${courseId}`);
        }
        return instructorId;
    }

 
    // get a specific module in a course
    async getModule(courseId: String, moduleId: String): Promise<String> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        if (!course.modules.includes(moduleId)) {
            throw new NotFoundException(`Module with ID ${moduleId} not found in course with ID ${courseId}`);
        }
        return moduleId;
    }

    // add an instructor to a course
    async addInstructor(courseId: String, instructorId: String): Promise<Course> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        course.instructor_ids.push(instructorId);
        return course.save();
    }

    // add a student to a course
    async addStudent(courseId: String, studentId: String): Promise<Course> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        course.students.push(studentId);
        return course.save();
    }

    // add a module to a course
    async addModule(courseId: String, moduleId: String): Promise<Course> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        course.modules.push(moduleId);
        return course.save();
    }

    // remove an instructor from a course
    async removeInstructor(courseId: String, instructorId: String): Promise<Course> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        course.instructor_ids = course.instructor_ids.filter(id => id !== instructorId);
        return course.save();
    }

    // remove a student from a course
    async removeStudent(courseId: String, studentId: String): Promise<Course> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        course.students = course.students.filter(id => id !== studentId);
        return course.save();
    }

    // remove a module from a course
    async removeModule(courseId: String, moduleId: String): Promise<Course> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        course.modules = course.modules.filter(id => id !== moduleId);
        return course.save();
    }

    //get course difficulty level
    async getDifficultyLevel(courseId: String): Promise<String> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        return course.difficulty_Level;
    }

    //get course category
    async getCategory(courseId: String): Promise<String> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        return course.category;
    }

    //get course rating
    async getRating(courseId: String): Promise<number> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        return course.rating;
    }

    // get course by difficulty level
    async getByDifficultyLevel(difficultyLevel: String): Promise<Course[]> {
        return this.courseModel.find({ difficulty_Level: difficultyLevel }).exec();
    }

    // get course by category
    async getByCategory(category: String): Promise<Course[]> {
        return this.courseModel.find({ category: category }).exec();
    }

    // get course by rating
    async getByRating(rating: number): Promise<Course[]> {
        return this.courseModel.find({ rating: rating }).exec();
    }




    
}
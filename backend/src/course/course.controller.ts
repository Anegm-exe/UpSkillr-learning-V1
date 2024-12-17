import { Controller, Get, Post, Delete, Body, Param, UseGuards, Patch, Req } from '@nestjs/common';
import { CourseService } from 'src/course/course.service';
import { Course } from 'src/course/model/course.schema';
import {Role, Roles} from 'src/Auth/decorators/roles.decorator';
import {authorizationGuard} from 'src/Auth/guards/authorization.guard';
import { CreateCourseDto, UpdateCourseDto } from './dtos/course.dto';
import { Request } from 'express';
import { CreateResponseDto } from 'src/response/dtos/response.dto';
import { CreateModuleDto } from 'src/module/dtos/module.dto';
import { AuthGuard } from 'src/Auth/guards/authentication.guard';

@Controller('course')
export class CourseController {
    constructor(private readonly courseService: CourseService) { }
    //create a course
    @Roles(Role.Instructor)
    @UseGuards(authorizationGuard)
    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() createCourseDto: CreateCourseDto, @Req() req:Request): Promise<Course> {
        return this.courseService.create(createCourseDto,req);
    }

    //get all courses
    
    @Get()
    async findAll(): Promise<Course[]> {
        return this.courseService.findAll();
    }
    
    // find courses that user is enrolled in 
    @Roles(Role.Student)
    @UseGuards(authorizationGuard)
    @UseGuards(AuthGuard)
    @Get('enrolled')
    async findEnrolledCourses(@Req() req: Request): Promise<Course[]> {
        return this.courseService.findEnrolledCourses(req);
    }

    //get course by name
    @Get('name/:name')
    async findByName(@Param('name') name: string): Promise<Course> {
        return this.courseService.findByName(name);
    }

    //add an instructor to a course
    @Roles(Role.Instructor,Role.Admin)
    @UseGuards(authorizationGuard)
    @UseGuards(AuthGuard)
    @Post(':id/instructors/:instructorId')
    async addInstructor(
        @Param('id') courseId: string,
        @Param('instructorId') instructorId: string,
    ): Promise<Course> {
        return this.courseService.addInstructor(courseId, instructorId);
    }

    //add a student to a course
    @Roles(Role.Student)
    @UseGuards(authorizationGuard)
    @UseGuards(AuthGuard)
    @Post(':id/apply')
    async apply(
        @Param('id') courseId: string,
        @Req() req: Request,
    ): Promise<Course> {
        return this.courseService.apply(courseId, req);
    }

    //remove a instructor from a course
    @Roles(Role.Admin,Role.Instructor)
    @UseGuards(authorizationGuard)
    @UseGuards(AuthGuard)
    @Delete(':id/instructors/:instructorId')
    async deleteInstructor(
        @Param('id') courseId: string,
        @Param('instructorId') instructorId: string,
    ): Promise<Course> {
        return this.courseService.removeInstructor(courseId, instructorId);
    }

    //remove a student from a course
    @Roles(Role.Admin,Role.Instructor)
    @UseGuards(authorizationGuard)
    @UseGuards(AuthGuard)
    @Delete(':id/students/:studentId')
    async deleteStudent(
        @Param('id') courseId: string,
        @Param('studentId') studentId: string,
    ): Promise<Course> {
        return this.courseService.removeStudent(courseId, studentId);
    }

    //remove a module from a course
    @Roles(Role.Admin,Role.Instructor)
    @UseGuards(authorizationGuard)
    @UseGuards(AuthGuard)
    @Delete(':id/modules/:moduleId')
    async deleteModule(
        @Param('id') courseId: string,
        @Param('moduleId') moduleId: string,
    ): Promise<Course> {
        return this.courseService.removeModule(courseId, moduleId);
    }

    //get course by category
    @Get('find/categories')
    async getByCategorys(@Body() categorys: string[]): Promise<Course[]> {
        return this.courseService.getByCategorys(categorys);
    }

    // find completed courses
    @Roles(Role.Student)
    @UseGuards(authorizationGuard)
    @Get('completed')
    async findCompletedCourses(
        @Req() req: Request
    ): Promise<Course[]> {
        return this.courseService.findCompletedCourses(req);
    }

    // get unique categories
    @Get('categories')
    async getCategories(): Promise<string[]> {
        return this.courseService.getUniqueCategories();
    }

    //get course by difficulty level
    @Get('difficulty/:difficulty')
    async getByDifficulty(@Param('difficulty') difficulty: string): Promise<Course[]> {
        return await this.courseService.getByDifficultyLevel(difficulty);
    }

    //get course by rating
    @Get('rating/:rating')
    async getByRating(@Param('rating') rating: number): Promise<Course[]> {
        return this.courseService.getByRating(rating);
    }


    // search
    @Roles(Role.Instructor,Role.Student)
    @UseGuards(authorizationGuard)
    @UseGuards(AuthGuard)
    @Get('searchCategory/:search')
    async searchByCategory(@Param('search') search: string): Promise<Course[]> {
        return this.courseService.searchByCategory(search);
    }

    // search
    @Roles(Role.Instructor,Role.Student)
    @UseGuards(authorizationGuard)
    @UseGuards(AuthGuard)
    @Get('searchName/:search')
    async searchByName(@Param('search') search: string): Promise<Course[]> {
        return this.courseService.searchByName(search);
    }

    // Get course by instructor 
    @Get('instructor/:instructorId')
    async getByInstructor(@Param('instructorId') instructorId: string): Promise<Course[]> {
        return await this.courseService.getByInstructor(instructorId);
    }

    @Roles(Role.Student)
    @UseGuards(authorizationGuard)
    @UseGuards(AuthGuard)
    @Post(':id/module/:moduleId/solvequiz')
    async solveQuiz(
        @Param('id') courseId: string, 
        @Param('moduleId') moduleId: string, 
        @Body() createResponseDto: CreateResponseDto,
        @Req() req: Request
    ): Promise<string> {
        return this.courseService.solveQuiz(courseId, moduleId,req,createResponseDto);
    }

    // retake quiz
    @Roles(Role.Student)
    @UseGuards(authorizationGuard)
    @UseGuards(AuthGuard)
    @Post(':id/module/:moduleId/retakequiz')
    async retakeQuiz(
        @Param('id') courseId: string, 
        @Param('moduleId') moduleId: string, 
        @Req() req: Request
    ): Promise<string> {
        return this.courseService.retakeQuiz(courseId, moduleId,req);
    }

    // Create module in course
    @Roles(Role.Instructor)
    @UseGuards(authorizationGuard)
    @UseGuards(AuthGuard)
    @Post(':id/module')
    async addModule(
        @Param('id') courseId: string,
        @Body() createModuleDto: CreateModuleDto,
        @Req() req: Request
    ) : Promise<Course> {
        return this.courseService.createModule(courseId, createModuleDto,req);
    }

    @Roles(Role.Instructor)
    @UseGuards(authorizationGuard)
    @UseGuards(AuthGuard)
    @Post(':course_id/module/:module_id/quizzes')
    async createQuizzes(
        @Param('course_id') courseId: string,
        @Param('module_id') moduleId: string
    ) : Promise<void> {
        return this.courseService.initializeAllQuizzes(courseId, moduleId);
    }

    //find a course by id
    @UseGuards(AuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Course> {
        return this.courseService.findOne(id);
    }

    //update a course
    @Roles(Role.Admin,Role.Instructor)
    @UseGuards(authorizationGuard)
    @UseGuards(AuthGuard)
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCourseDto: UpdateCourseDto,
    ): Promise<Course> {
        return this.courseService.update(id, updateCourseDto);
    }

    //delete a course
    @Roles(Role.Admin,Role.Instructor)
    @UseGuards(authorizationGuard)
    @UseGuards(AuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string, @Req() req: Request): Promise<void> {
        this.courseService.changeArchiveStatus(id,req);
    }    
}

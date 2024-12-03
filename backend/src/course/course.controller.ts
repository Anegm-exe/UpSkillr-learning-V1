import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { CourseService } from 'src/course/course.service';
import { Course } from 'src/schemas/course.schema';
import {Role, Roles} from 'src/Auth/decorators/roles.decorator';
import {authorizationGuard} from 'src/Auth/guards/authorization.guard';
@Controller('courses')
export class CourseController {
    constructor(private readonly courseService: CourseService) { }
    //create a course
    @Post()
    @Roles(Role.Instructor,Role.Admin)
    @UseGuards(authorizationGuard)
    async create(@Body() createCourseDto: Course): Promise<Course> {
        return this.courseService.create(createCourseDto);
    }

    //get all courses
    @Get()
    async findAll(): Promise<Course[]> {
        return this.courseService.findAll();
    }
    
    //find a course by id
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Course> {
        return this.courseService.findOne(id);
    }

    //update a course
    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateCourseDto: Partial<Course>,
    ): Promise<Course> {
        return this.courseService.update(id, updateCourseDto);
    }

    //delete a course
    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.courseService.delete(id);
    }

    //get course by name
    @Get('name/:name')
    async findByName(@Param('name') name: string): Promise<Course> {
        return this.courseService.findByName(name);
    }

    //get all instructors for a course
    @Get(':id/instructors')
    async getInstructors(@Param('id') courseId: string): Promise<string[]> {
        return this.courseService.getInstructors(courseId);
    }

    //get all students for a course
    @Roles(Role.Instructor,Role.Admin)
    @UseGuards(authorizationGuard)
    @Get(':id/students')
    async getStudents(@Param('id') courseId: string): Promise<string[]> {
        return this.courseService.getStudents(courseId);
    }

    //get all modules for a course
    @Get(':id/modules')
    async getModules(@Param('id') courseId: string): Promise<string[]> {
        return this.courseService.getModules(courseId);
    }

    //get a specific student by ID
    @Roles(Role.Instructor,Role.Admin)
    @UseGuards(authorizationGuard)
    @Get(':id/students/:studentId')
    async getStudent(
        @Param('id') courseId: string,
        @Param('studentId') studentId: string,
    ): Promise<string> {
        return this.courseService.getStudent(courseId, studentId);
    }

    //get a specific student by name
    @Roles(Role.Instructor,Role.Admin)
    @UseGuards(authorizationGuard)
    @Get(':id/students/name/:studentName')
    async getStudentByName(
        @Param('id') courseId: string,
        @Param('studentName') studentName: string,
    ): Promise<string> {
        return this.courseService.getStudentByName(courseId, studentName);
    }

    //get a specific instructor by ID
    @Get(':id/instructors/:instructorId')
    async getInstructor(
        @Param('id') courseId: string,
        @Param('instructorId') instructorId: string,
    ): Promise<string> {
        return this.courseService.getInstructor(courseId, instructorId);
    }

    //get a specific module
    @Get(':id/modules/:moduleId')
    async getModule(
        @Param('id') courseId: string,
        @Param('moduleId') moduleId: string,
    ): Promise<string> {
        return this.courseService.getModule(courseId, moduleId);
    }

    //add an instructor to a course
    @Patch(':id/instructors/:instructorId')
    async addInstructor(
        @Param('id') courseId: string,
        @Param('instructorId') instructorId: string,
    ): Promise<Course> {
        return this.courseService.addInstructor(courseId, instructorId);
    }

    //add a student to a course
    @Patch(':id/students/:studentId')
    async addStudent(
        @Param('id') courseId: string,
        @Param('studentId') studentId: string,
    ): Promise<Course> {
        return this.courseService.addStudent(courseId, studentId);
    }

    //add a module to a course
    @Patch(':id/modules/:moduleId')
    async addModule(
        @Param('id') courseId: string,
        @Param('moduleId') moduleId: string,
    ): Promise<Course> {
        return this.courseService.addModule(courseId, moduleId);
    }

    //remove a instructor from a course
    @Delete(':id/instructors/:instructorId')
    async deleteInstructor(
        @Param('id') courseId: string,
        @Param('instructorId') instructorId: string,
    ): Promise<Course> {
        return this.courseService.removeInstructor(courseId, instructorId);
    }

    //remove a student from a course
    @Delete(':id/students/:studentId')
    async deleteStudent(
        @Param('id') courseId: string,
        @Param('studentId') studentId: string,
    ): Promise<Course> {
        return this.courseService.removeStudent(courseId, studentId);
    }

    //remove a module from a course
    @Delete(':id/modules/:moduleId')
    async deleteModule(
        @Param('id') courseId: string,
        @Param('moduleId') moduleId: string,
    ): Promise<Course> {
        return this.courseService.removeModule(courseId, moduleId);
    }

    //get difficulty level of a course
    @Get(':id/difficulty')
    async getDifficultyLevel(@Param('id') courseId: string): Promise<string> {
        return this.courseService.getDifficultyLevel(courseId);
    }

    //get course rating
    @Get(':id/rating')
    async getRating(@Param('id') courseId: string): Promise<number> {
        return this.courseService.getRating(courseId);
    }

    //get course category
    @Get(':id/category')
    async getCategory(@Param('id') courseId: string): Promise<string> {
        return this.courseService.getCategory(courseId);
    }

    //get course by category
    @Get('category/:category')
    async getByCategory(@Param('category') category: string): Promise<Course[]> {
        return this.courseService.getByCategory(category);
    }

    //get course by difficulty level
    @Get('difficulty/:difficulty')
    async getByDifficulty(@Param('difficulty') difficulty: string): Promise<Course[]> {
        return this.courseService.getByDifficultyLevel(difficulty);
    }

    //get course by rating
    @Get('rating/:rating')
    async getByRating(@Param('rating') rating: number): Promise<Course[]> {
        return this.courseService.getByRating(rating);
    }
    
    //get all quizzes for a course
    @Roles(Role.Instructor,Role.Admin)
    @UseGuards(authorizationGuard)
    @Get(':id/quizzes')
    async getQuizzes(@Param('id') courseId: string): Promise<string[]> {
        return this.courseService.getQuizzes(courseId);
    }

    //add a quiz to a course
    @Roles(Role.Instructor,Role.Admin)
    @UseGuards(authorizationGuard)
    @Patch(':id/quizzes/:quizId')
    async addQuiz(
        @Param('id') courseId: string,
        @Param('quizId') quizId: string,
    ): Promise<Course> {
        return this.courseService.addQuiz(courseId, quizId);
    }

    //remove a quiz from a course
    @Roles(Role.Instructor,Role.Admin)
    @UseGuards(authorizationGuard)
    @Delete(':id/quizzes/:quizId')
    async deleteQuiz(
        @Param('id') courseId: string,
        @Param('quizId') quizId: string,
    ): Promise<Course> {
        return this.courseService.removeQuiz(courseId, quizId);
    }

}

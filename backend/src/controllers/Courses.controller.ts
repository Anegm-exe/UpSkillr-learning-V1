import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CourseService } from 'src/services/Courses.service';
import { Course } from 'src/schemas/course.schema';

@Controller('courses')
export class CoursesController {
    constructor(private readonly courseService: CourseService) { }
    //create a course
    @Post()
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
    async findOne(@Param('id') id: String): Promise<Course> {
        return this.courseService.findOne(id);
    }

    //update a course
    @Put(':id')
    async update(
        @Param('id') id: String,
        @Body() updateCourseDto: Partial<Course>,
    ): Promise<Course> {
        return this.courseService.update(id, updateCourseDto);
    }

    //delete a course
    @Delete(':id')
    async delete(@Param('id') id: String): Promise<void> {
        return this.courseService.delete(id);
    }

    //get course by name
    @Get('name/:name')
    async findByName(@Param('name') name: String): Promise<Course> {
        return this.courseService.findByName(name);
    }

    //get all instructors for a course
    @Get(':id/instructors')
    async getInstructors(@Param('id') courseId: String): Promise<String[]> {
        return this.courseService.getInstructors(courseId);
    }

    //get all students for a course
    @Get(':id/students')
    async getStudents(@Param('id') courseId: String): Promise<String[]> {
        return this.courseService.getStudents(courseId);
    }

    //get all modules for a course
    @Get(':id/modules')
    async getModules(@Param('id') courseId: String): Promise<String[]> {
        return this.courseService.getModules(courseId);
    }

    //get a specific student by ID
    @Get(':id/students/:studentId')
    async getStudent(
        @Param('id') courseId: String,
        @Param('studentId') studentId: String,
    ): Promise<String> {
        return this.courseService.getStudent(courseId, studentId);
    }

    //get a specific student by name
    @Get(':id/students/name/:studentName')
    async getStudentByName(
        @Param('id') courseId: String,
        @Param('studentName') studentName: String,
    ): Promise<String> {
        return this.courseService.getStudentByName(courseId, studentName);
    }

    //get a specific instructor by ID
    @Get(':id/instructors/:instructorId')
    async getInstructor(
        @Param('id') courseId: String,
        @Param('instructorId') instructorId: String,
    ): Promise<String> {
        return this.courseService.getInstructor(courseId, instructorId);
    }

    //get a specific module
    @Get(':id/modules/:moduleId')
    async getModule(
        @Param('id') courseId: String,
        @Param('moduleId') moduleId: String,
    ): Promise<String> {
        return this.courseService.getModule(courseId, moduleId);
    }

    //add an instructor to a course
    @Post(':id/instructors/:instructorId')
    async addInstructor(
        @Param('id') courseId: String,
        @Param('instructorId') instructorId: String,
    ): Promise<Course> {
        return this.courseService.addInstructor(courseId, instructorId);
    }

    //add a student to a course
    @Post(':id/students/:studentId')
    async addStudent(
        @Param('id') courseId: String,
        @Param('studentId') studentId: String,
    ): Promise<Course> {
        return this.courseService.addStudent(courseId, studentId);
    }

    //add a module to a course
    @Post(':id/modules/:moduleId')
    async addModule(
        @Param('id') courseId: String,
        @Param('moduleId') moduleId: String,
    ): Promise<Course> {
        return this.courseService.addModule(courseId, moduleId);
    }

    //remove a instructor from a course
    @Delete(':id/instructors/:instructorId')
    async deleteInstructor(
        @Param('id') courseId: String,
        @Param('instructorId') instructorId: String,
    ): Promise<Course> {
        return this.courseService.removeInstructor(courseId, instructorId);
    }

    //remove a student from a course
    @Delete(':id/students/:studentId')
    async deleteStudent(
        @Param('id') courseId: String,
        @Param('studentId') studentId: String,
    ): Promise<Course> {
        return this.courseService.removeStudent(courseId, studentId);
    }

    //remove a module from a course
    @Delete(':id/modules/:moduleId')
    async deleteModule(
        @Param('id') courseId: String,
        @Param('moduleId') moduleId: String,
    ): Promise<Course> {
        return this.courseService.removeModule(courseId, moduleId);
    }

    //get difficulty level of a course
    @Get(':id/difficulty')
    async getDifficultyLevel(@Param('id') courseId: String): Promise<String> {
        return this.courseService.getDifficultyLevel(courseId);
    }

    //get course rating
    @Get(':id/rating')
    async getRating(@Param('id') courseId: String): Promise<number> {
        return this.courseService.getRating(courseId);
    }

    //get course category
    @Get(':id/category')
    async getCategory(@Param('id') courseId: String): Promise<String> {
        return this.courseService.getCategory(courseId);
    }

    //get course by category
    @Get('category/:category')
    async getByCategory(@Param('category') category: String): Promise<Course[]> {
        return this.courseService.getByCategory(category);
    }

    //get course by difficulty level
    @Get('difficulty/:difficulty')
    async getByDifficulty(@Param('difficulty') difficulty: String): Promise<Course[]> {
        return this.courseService.getByDifficultyLevel(difficulty);
    }

    //get course by rating
    @Get('rating/:rating')
    async getByRating(@Param('rating') rating: number): Promise<Course[]> {
        return this.courseService.getByRating(rating);
    }





}

import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {Course, CourseDocument} from './model/course.schema';
import { CreateCourseDto, UpdateCourseDto } from './dtos/course.dto';
import { Request } from 'express';
import { ProgressService } from 'src/progress/progress.service';
import { QuestionService } from 'src/question/question.service';
import { QuizService } from 'src/quiz/quiz.service';
import { ResponseService } from 'src/response/response.service';
import { ModuleService } from 'src/module/module.service';
import { Questions } from 'src/question/model/question.schema';
import { CreateResponseDto } from 'src/response/dtos/response.dto';
import { NotificationService } from 'src/notification/notifications.service';
import { CreateModuleDto } from 'src/module/dtos/module.dto';
import { createObjectCsvStringifier } from 'csv-writer';

@Injectable()
export class CourseService{
    constructor(
        @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
        private readonly quizService: QuizService,
        private readonly questionService: QuestionService,
        private readonly progressService: ProgressService,
        private readonly responseService: ResponseService,
        private readonly moduleService: ModuleService,
        private readonly notificationService: NotificationService
    ) { }

    // create a new course
    async create(course: CreateCourseDto,req: Request): Promise<Course> {
        const newCourse = new this.courseModel(course);
        newCourse.instructor_ids.push(req['user'].userid);
        return newCourse.save();
    }

    // get all courses
    async findAll(): Promise<Course[]> {
        return this.courseModel.find().exec();
    }

    // New findAllActive function
  async findAllActive(): Promise<Course[]> {
    return this.courseModel.find({ isArchived: false }).exec();
  }

    // find a course by id
    async findOne(id: string): Promise<Course> {
        const course = await this.courseModel.findOne({ _id: id }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
    }

    // update a course
    async update(id: string, updateData: UpdateCourseDto): Promise<Course> {
        const updatedCourse = await this.courseModel
            .findOneAndUpdate({ _id: id },updateData, { new: true })
            .exec();
        if (!updatedCourse) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
        return updatedCourse;
    }    

    // delete a course
    async delete(id: string): Promise<void> {
        const result = await this.courseModel.deleteOne({ _id: id }).exec();
        if (result.deletedCount === 0) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
    }

    // get course by name by regex
    async findByName(name: string): Promise<Course> {
        const course = await this.courseModel.findOne({ name: { $regex: name, $options: 'i' } }).exec();
        if (!course) {
            throw new NotFoundException(`Course with name ${name} not found`);
        }
        return course;
    }

    // get all instructors for a course
    async getInstructors(courseId: string): Promise<string[]> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        return course.instructor_ids;
    }

    // add an instructor to a course
    async addInstructor(courseId: string, instructorId: string): Promise<Course> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        course.instructor_ids.push(instructorId);
        await this.notificationService.create({user_ids:[instructorId],message:`You have been added as an instructor to ${course.title} course!`})
        await this.notificationService.create({user_ids:course.students,message:`A new instructor has been added to ${course.title} course!`})
        return course.save();
    }

    // return by categories
    async getByCategorys(categorys: string[]): Promise<Course[]> {
        return this.courseModel.find({ category: { $in: categorys } }).exec();
    }

    // get uniqe categories
    async getUniqueCategories(): Promise<string[]> {
        const categories = await this.courseModel.distinct('category').exec();
        return categories.filter(category => category !== null && category !== undefined && category !== '');
    }

    // get by instrucotr_id
    async getByInstructor(instructorId: string): Promise<any[]> {
        return this.courseModel.find({ instructor_ids:instructorId}).populate([{ path: 'students', select: ['name']}]).exec();
    }

    // search course by title
    async searchByCategory(caetegory: string): Promise<Course[]> {
        return this.courseModel.find({ category: { $regex: caetegory, $options: 'i' } }).exec();
    }

    async searchByName(title: string): Promise<Course[]> {
        return this.courseModel.find({ title: { $regex: title, $options: 'i' } }).exec();
    }

    // courses completed
    async findCompletedCourses(req:Request) : Promise<Course[]> {
        const courses = await this.findEnrolledCourses(req);
        const completedCourses = await Promise.all(
            courses.map(async (course) => {
                if(await this.progressService.isCourseCompletedByUser(course._id,req['user'].userid))
                    return course;
            })
        );
        return completedCourses;
    }

    // courses completed
    async findCompletedStudents(courseId: string): Promise<string[]> {
        const course = await this.courseModel.findById(courseId).populate('students').exec();
        const students = await Promise.all(
            course.students.map(async (student: any) => {
                if (await this.progressService.isCourseCompletedByUser(courseId, student._id)) {
                    return student.name;
                }
            })
        );
    
        return students.filter((name) => name !== undefined && name !== null) as string[];
    }
    

    // Get student preformance 
    async getStudentPerformance(req:Request, courseId: string) : 
        Promise<{
            Below_average:number,
            Average:number,
            Above_Average:number,
            Excellent: number
        }> {
        const course = await this.courseModel.findById(courseId).exec();
        // check course
        if (!course) {
            throw new NotFoundException('Course not found');
        }
        // check if instructor gives the course
        if(!course.instructor_ids.includes(req['user'].userid)) {
            throw new UnauthorizedException('You are not authorized to access this course');
        }
        const progresses = await this.progressService.findProgressesByCourse(courseId);
        const res = {
            Below_average:0,
            Average:0,
            Above_Average:0,
            Excellent: 0
        }
        Promise.all(progresses.map((progress)=>{
            if(progress.average_quiz < 50) {
                res.Below_average++;
            }
            else if(progress.average_quiz < 70) {
                res.Average++;
            }
            else if(progress.average_quiz < 90) {
                res.Above_Average++;
            }
            else {
                res.Excellent++;    
            }
        }))
        return res;
    }

    // add a student to a course
    async apply(courseId: string, req: Request): Promise<Course> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        if(course.isArchived) {
            throw new BadRequestException('Course is unavailable');
        }
        course.students.push(req['user'].userid);
        this.progressService.create({course_id:courseId,user_id: req['user'].userid});
        // send a notification
        await this.notificationService.create({user_ids:[req['user'].userid],message:`You successfuly enrolled in ${course.title} course!`});
        return course.save();
    }
        

    async exportAnalytics(req: Request, rating:number): Promise<string> {
        const instructorId = req['user'].userid || '6755e5161cccf04a9ee865d6';
    
        // Fetch courses by instructor
        const courses = await this.getByInstructor(instructorId);
        if (!courses || courses.length === 0) {
            throw new NotFoundException('No courses found for the instructor');
        }
    
        // Prepare analytics data
        const analytics = [];
    
        for (const course of courses) {
            const modules = await this.moduleService.findAllByCourseIntructor(course._id,); // Fetch modules
            const ratings = modules.map((module) => {
                if(module.ratings.length===0)
                    return 0;
                return module.ratings.reduce((a, b) => a + b, 0)/module.ratings.length;
            });
            const courseRating = (await this.updateRating(course._id)).rating;
            const instructorRating = rating;
            console.log(course)
            const enrolledStudents = course.students.map(student => student.name);
            const completedStudents = await this.findCompletedStudents(course._id);
    
            const studentPerformanceMetrics = await this.getStudentPerformance(req,course._id);
    
            analytics.push({
                courseId: course._id,
                courseName: course.title,
                moduleRatings: ratings,
                courseRating,
                instructorRating,
                enrolledStudents,
                completedStudents,
                belowAverage: studentPerformanceMetrics.Below_average,
                average: studentPerformanceMetrics.Average,
                aboveAverage: studentPerformanceMetrics.Above_Average,
                excellent: studentPerformanceMetrics.Excellent,
            });
        }
    
        // Define the CSV writer
        const csvStringifier = createObjectCsvStringifier({
            header: [
                { id: 'courseId', title: 'Course ID' },
                { id: 'courseName', title: 'Course Name' },
                { id: 'moduleRatings', title: 'Module Ratings' },
                { id: 'courseRating', title: 'Course Rating' },
                { id: 'instructorRating', title: 'Instructor Rating' },
                { id: 'enrolledStudents', title: 'Enrolled Students' },
                { id: 'completedStudents', title: 'Completed Students' },
                { id: 'belowAverage', title: 'Below Average Students' },
                { id: 'average', title: 'Average Students' },
                { id: 'aboveAverage', title: 'Above Average Students' },
                { id: 'excellent', title: 'Excellent Students' },
            ],
        });
    
        // Generate the CSV content
        const csvHeader = csvStringifier.getHeaderString();
        const csvBody = csvStringifier.stringifyRecords(analytics);
    
        // Return the complete CSV string
        return csvHeader + csvBody;
    }

    // find enrolled courses for user
    async findEnrolledCourses(req: Request): Promise<Course[]> {
        return this.courseModel.find({ students: req['user'].userid }).exec(); 
    }

    // get enrolled course by student id
    async getEnrolledCourses(studentId: string): Promise<Course[]> {
        return this.courseModel.find({ students: studentId }).exec();
    }

    // remove an instructor from a course
    async removeInstructor(courseId: string, instructorId: string): Promise<Course> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        // check if instructor in course
        if (!course.instructor_ids.includes(instructorId)) {
            throw new NotFoundException(`Instructor with ID ${instructorId} not found in course with ID ${courseId}`)
        }
        await this.notificationService.create({user_ids:course.students,message:`An instructor has been removed from ${course.title} course!`})
        course.instructor_ids = course.instructor_ids.filter(id => id !== instructorId);
        return course.save();
    }

    // remove a student from a course
    async removeStudent(courseId: string, studentId: string): Promise<Course> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        if(!course.students.includes(studentId)) {
            throw new NotFoundException(`Student with ID ${studentId} not found in course with ID ${courseId}`)
        }
    
        course.students = course.students.filter(id => id !== studentId);
        return course.save();
    }

    // remove a module from a course
    async removeModule(courseId: string, moduleId: string): Promise<Course> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        
        course.modules = course.modules.filter(id => id !== moduleId);
        await this.notificationService.create({user_ids:course.students,message:`A module has been removed from ${course.title} course!`})
        return course.save();
    }

    // get course by difficulty level
    async getByDifficultyLevel(difficultyLevel: string): Promise<Course[]> {
        return this.courseModel.find({ difficulty_Level: difficultyLevel }).exec();
    }

    // get course by rating
    async getByRating(rating: number): Promise<Course[]> {
        return this.courseModel.find({ rating: rating }).exec();
    }  
    
    // calculate course rating
    async updateRating(courseId: string): Promise<Course> {
        const course = await this.courseModel.findOne({ _id: courseId }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
        let totalratings = 0;
        let count = 0;
        // add all module ratings
        await Promise.all(course.modules.map(async (moduleId) => {
            const module = await this.moduleService.findOne(moduleId);
            if(module.ratings.length > 0) {
                totalratings += module.ratings.reduce((rating,sum) => rating+sum,0);
                count+=module.ratings.length;
            }
        }))
        if(count === 0)
            return course;
        // calculate average rating
        const averageRating = totalratings / count;
        const updatedCourse = await this.courseModel.findByIdAndUpdate({_id:courseId},{rating:averageRating},{new:true});
        return updatedCourse;
    }

    // generate Quiz
    async generateQuiz(course_id:string, moduleId: string, user_id:string): Promise<string> {
        const course = await this.courseModel.findOne({ _id: course_id }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${course_id} not found`);
        }
        const module = await this.moduleService.findOne(moduleId);
        if (!module) {
            throw new NotFoundException(`Module with ID ${moduleId} not found`);
        }
        // check if module is in course
        if(!course.modules.includes(moduleId)) {
            throw new NotFoundException(`Module with ID ${moduleId} not found in course with ID ${course_id}`)
        }
        
        const progress = await this.progressService.findByUserAndCourse(user_id, course_id);
        if(!progress) {
            throw new NotFoundException(`Progress with User ID ${user_id} and Course ID ${course_id} not found`);
        }

        // check if module difficulty is harder than the student preformance
        if(
            module.difficulty === 'hard' && progress.average_quiz && progress.average_quiz < 0.75 ||
            module.difficulty === 'medium' && progress.average_quiz && progress.average_quiz < 0.5 
        ) {

            throw new UnauthorizedException(`You can't take this quiz because your performance is not good enough`)
        }

        const question_bank = await Promise.all(
            module.question_bank.map(async (questionId) => {
                return await this.questionService.findOne(questionId)
            }
        ));

        // Get n Random Questions Based On type 
        function getRandomItems(questions:Questions[], n:number, questionDifficulty:string[], type: string) {
            let filter = questions.filter(question => 
                questionDifficulty.includes(question.difficulty) && 
                type === question.type
            );
            if(type === 'both') 
                filter = questions.filter(question => questionDifficulty.includes(question.difficulty));

            // suffle the array
            for (let i = filter.length - 1; i > 0; i--) { 
                const j = Math.floor(Math.random() * (i + 1)); 
                [filter[i], filter[j]] = [filter[j], filter[i]]; 
            } 
            // return the first n items
            return filter.slice(0, n)
        }

        let questions;
        if(!progress.average_quiz || progress.average_quiz >= 0.75) 
            questions = getRandomItems(question_bank,module.no_question,['easy','medium','hard'],module.type)
        else if(progress.average_quiz >= 0.50) 
            questions = getRandomItems(question_bank,module.no_question,['easy','medium'],module.type)
        else
            questions = getRandomItems(question_bank,module.no_question,['easy'],module.type)

        // Create a new quiz
        const quiz = await this.quizService.create({
            questions: questions,
            type: module.type,
            user_id: user_id,
            module_id:moduleId
        });
        return quiz._id;
    }

    // Initialize All Quizzer for users
    async initializeAllQuizzes(course_id:string, module_id:string): Promise<void> {
        const course = await this.courseModel.findOne({ _id: course_id }).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${course_id} not found`)
        }
        const module = await this.moduleService.findOne(module_id)
        if (!module) {
            throw new NotFoundException(`Module with ID ${module_id} not found`)
        }
        const quizzes = await Promise.all(
            course.students.map(async (studentId) => {
                return await this.generateQuiz(course_id, module_id, studentId)
            }
        ));
        await this.moduleService.addQuizzes(module_id,quizzes);
        await this.notificationService.create({
            user_ids:course.students,
            message:`A new quiz has been added to ${course.title} course!`
        })
    }

    // solve quiz
    async solveQuiz(course_id:string, module_id:string, req: Request, CreateResponseDto: CreateResponseDto): Promise<string> {
        const course = await this.courseModel.findOne({_id:course_id}).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${course_id} not found`);
        }
        // check if student is enrolled
        if(!course.students.includes(req['user'].userid)) {
             throw new UnauthorizedException(`You are not enrolled in this course`)
        }
        const module = await this.moduleService.findOne(module_id);
        if (!module) {
            throw new NotFoundException(`Module with ID ${module_id} not found`)
        }
        // check if course has module
        if(!course.modules.includes(module_id)){
            throw new NotFoundException(`Module with ID ${module_id} not found in course with ID ${course_id}`)
        }
        const quiz = await this.quizService.findByUserAndModule(req['user'].userid,module_id);
        if (!quiz) {
            throw new NotFoundException(`Quiz not found`);
        }
        const quiz_id = quiz._id;
        // check if quiz is in module.quizzes
        if(!module.quizzes.includes(quiz_id)){
            throw new NotFoundException(`Quiz with ID ${quiz_id} not found in module with ID ${module_id}`);
        }
        // check if user matches the user in the quiz
        if (quiz.user_id !== req['user'].userid) {
            throw new UnauthorizedException('You are not authorized to solve this quiz.');
        }
        // Check if the quiz is already solved by the user
        const responseExists = await this.responseService.findByQuizAndUser(quiz_id, req['user'].userid);
        if (responseExists) {
            throw new BadRequestException('You have already solved this quiz.');
        }
        const response = await this.responseService.create(CreateResponseDto);
        const progress = await this.progressService.findByUserAndCourse(req['user'].userid, module.course_id);

        // Add the new response
        progress.completed_modules.push({ module_id: module_id,score:response.score});

        // Update the average quiz score
        const totalScore = progress.completed_modules.reduce((sum, item) => sum + item.score, 0);
        progress.average_quiz = totalScore / progress.completed_modules.length;

        // Update the completion percentage
        progress.completion_percentage = (progress.completed_modules.length / course.modules.length) * 100;

        // Save the updated progress
        await this.progressService.update(progress._id, progress);

        return response._id;
    }

    // retake quiz in module
    async retakeQuiz(course_id:string, module_id:string, req: Request) : Promise<string> {
        const course = await this.courseModel.findOne({_id:course_id}).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${course_id} not found`)
        }
        // check if course has module
        if(!course.modules.includes(module_id)) {
        throw new NotFoundException(`Module with ID ${module_id} not found in course with ID ${course_id}`)
        }
        const module = await this.moduleService.findOne(module_id);
        if (!module)  {
            throw new NotFoundException(`Module with ID ${module_id} not found`)
        }
        const quiz = await this.quizService.findByUserAndModule(req['user'].userid, module_id);
        if (!quiz) {
            throw new NotFoundException(`Quiz not found for user and module`)
        }
        // check if user has solved the quiz before
        const response = await this.responseService.findByQuizAndUser(quiz._id, req['user'].userid)
        if (!response)  {
            throw new NotFoundException(`You have not solved the quiz before`)
        }
        // remove module from progress
        const progress = await this.progressService.findByUserAndCourse(req['user'].userid, course_id);
        if (!progress)  
            throw new NotFoundException(`Progress not found for user and course`)
        const moduleIndex = progress.completed_modules.findIndex(item => item.module_id === module_id);
        if (moduleIndex !== -1)  
            progress.completed_modules.splice(moduleIndex, 1);
        await this.progressService.update(progress._id, progress)
        
        // Delete the existing response and quiz
        await this.moduleService.deleteQuiz(module_id,quiz._id);
        await this.responseService.delete(response._id);

        const newQuiz = await this.generateQuiz(course_id, module_id, req['user'].userid);
        await this.moduleService.addQuizzes(module_id,[newQuiz]);
        return newQuiz;
    }

    // chaneg Archive status of course
    async changeArchiveStatus(course_id:string, req: Request): Promise<Course> {
        const course = await this.courseModel.findOne({_id:course_id}).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${course_id} not found`)
        }
        // send notificaation about the status to students
        await this.notificationService.create({
            message: `Course with ID ${course_id} has been ${course.isArchived ? 'unarchived' : 'archived'}`,
            user_ids: course.students
        });
        course.isArchived = !course.isArchived;
        return await course.save();
    }

    // create module
    async createModule(course_id: string,createModuleDto: CreateModuleDto, req: Request): Promise<Course> {
        const course = await this.courseModel.findOne({_id:course_id}).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${course_id} not found`)
        }
        if (!course.instructor_ids.includes(req['user'].userid) && req['user'].role !== 'admin')  {
            throw new UnauthorizedException('You are not authorized to create a module for this course.');
        }
        const module = await this.moduleService.create(createModuleDto,course_id);
        course.modules.push(module._id);
        await this.notificationService.create({
            message: `A new module has been added to the ${course.title} course.`,
            user_ids: course.students
        });
        return await course.save();
    }

    //change course status
    async changeCourseStatus(course_id: string, req: Request): Promise<Course> {
        const course = await this.courseModel.findOne({_id:course_id}).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${course_id} not found`)
        }
        if (!course.instructor_ids.includes(req['user'].userid) && req['user'].role !== 'admin')  {
            throw new UnauthorizedException('You are not authorized to change status of this course.');
        }
        course.isArchived = !course.isArchived;
        return await course.save();
    }

    //students who completed course taught by instructor

    async CompletedInstructorStudents(req: Request): Promise<string[]> {
        console.log('CompletedInstructorStudents method called');
    
        // Extract instructor ID from the request user object
        const instructorId = req['user'].userid;
        console.log('Instructor ID:', instructorId);
    
        // Find all courses taught by the instructor
        const courses = await this.getByInstructor(instructorId);
        console.log('Courses taught by instructor:', courses);
    
        // Find all students who completed each course
        const students = await Promise.all(
          courses.map(async (course) => {
            const completedStudents = await this.findCompletedStudents(course._id);
            console.log(`Completed students for course ${course._id}:`, completedStudents);
            return completedStudents;
          })
        );
    
        // Flatten the array of arrays and return the student IDs
        const flattenedStudents = students.flat();
        console.log('All completed students:', flattenedStudents);
        return flattenedStudents;
      }
    

}
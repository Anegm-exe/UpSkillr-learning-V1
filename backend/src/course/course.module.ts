import { MiddlewareConsumer,Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Course, CourseSchema } from 'src/schemas/course.schema'
import { AuthenticationMiddleware } from 'src/Auth/middleware/authentication.middleware'
import { CoursesController } from './Courses.controller'
import { CourseService } from './Courses.service'
import {ModuleModule } from 'src/module/module.module'
import { QuizModule } from 'src/quiz/quiz.module'


@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Course.name,
            schema: CourseSchema
        }]),
        ModuleModule,
        QuizModule
    ],
    controllers:[CoursesController],
    providers:[CourseService],
    exports: [CourseService]
})


export class CourseModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticationMiddleware)
            .forRoutes(CoursesController);
    }
}
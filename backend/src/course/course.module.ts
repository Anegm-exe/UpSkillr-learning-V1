import { MiddlewareConsumer,Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Course, CourseSchema } from 'src/course/model/course.schema'
import { AuthenticationMiddleware } from 'src/Auth/middleware/authentication.middleware'
import { CourseController } from './course.controller'
import { CourseService } from './course.service'
import { ProgressModule } from 'src/progress/progress.module'
import { ModuleModule } from 'src/module/module.module'
import { QuizModule } from 'src/quiz/quiz.module'
import { QuestionModule } from 'src/question/question.module'
import { ResponseModule } from 'src/response/response.module'
import { NotificationModule } from 'src/notification/notification.module'


@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Course.name,
            schema: CourseSchema
        }]),
        ProgressModule,
        ModuleModule,
        QuizModule,
        QuestionModule,
        ResponseModule,
        NotificationModule
    ],
    controllers:[CourseController],
    providers:[CourseService],
    exports: [CourseService]
})


export class CourseModule {}
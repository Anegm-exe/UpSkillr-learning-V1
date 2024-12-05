import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from 'src/schemas/course.schema';
import { AuthenticationMiddleware } from 'src/Auth/middleware/authentication.middleware';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { ModuleModule } from 'src/module/module.module';
import { QuizModule } from 'src/quiz/quiz.module';
import { UserModule } from 'src/user/user.module'; // Import UserModule

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: Course.name,
            schema: CourseSchema
        }]),
        ModuleModule,
        QuizModule,
        UserModule // Add UserModule here
    ],
    controllers: [CourseController],
    providers: [CourseService],
    exports: [CourseService]
})
export class CourseModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticationMiddleware)
            .forRoutes(CourseController);
    }
}
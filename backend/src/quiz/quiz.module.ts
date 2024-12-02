import { MiddlewareConsumer, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Quiz, QuizSchema } from 'src/schemas/quiz.schema'
import { QuizController } from './quiz.controller'
import { QuizService } from './quiz.service'
import { QuestionModule } from 'src/question/question.module'
import { AuthenticationMiddleware } from 'src/Auth/middleware/authentication.middleware'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Quiz.name,
            schema: QuizSchema
        }]),
        QuestionModule
    ],
    controllers:[QuizController],
    providers:[QuizService]
})

export class QuizModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticationMiddleware)
            .forRoutes(QuizController);
    }
}
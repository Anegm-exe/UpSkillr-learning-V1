import { MiddlewareConsumer, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Questions, QuestionsSchema } from 'src/question/model/question.schema'
import { QuestionService } from './question.service'
import { QuestionController } from './question.controller'
import { AuthenticationMiddleware } from 'src/Auth/middleware/authentication.middleware'

@Module({
    imports:[
        MongooseModule.forFeature([
            {
                name: Questions.name,
                schema: QuestionsSchema
            }
        ])
    ],
    controllers:[QuestionController],
    providers:[QuestionService],
    exports: [QuestionService]
})

export class QuestionModule {}
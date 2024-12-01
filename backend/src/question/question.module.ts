import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Questions, QuestionsSchema } from 'src/schemas/question.schema'
import { QuestionService } from './question.service'
import { QuestionController } from './question.controller'

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
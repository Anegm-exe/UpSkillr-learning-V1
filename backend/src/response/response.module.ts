import { MiddlewareConsumer, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Response, ResponseSchema } from 'src/schemas/response.schema'
import { ResponseController } from './response.controller'
import { ResponseService } from './response.service'
import { QuestionService } from 'src/question/question.service'
import { QuestionModule } from 'src/question/question.module'
import { AuthenticationMiddleware } from 'src/Auth/middleware/authentication.middleware'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Response.name,
            schema: ResponseSchema
        }]),
        QuestionModule
    ],
    controllers:[ResponseController],
    providers:[ResponseService]
})

export class ResponseModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticationMiddleware)
            .forRoutes(ResponseController);
    }
}
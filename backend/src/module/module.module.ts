import { MiddlewareConsumer, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Modules, ModuleSchema } from 'src/module/model/module.schema'
import { ModuleController } from './module.controller'
import { ModuleService } from './module.service'
import { CourseModule } from 'src/course/course.module'
import { AuthenticationMiddleware } from 'src/Auth/middleware/authentication.middleware'
import { QuestionModule } from 'src/question/question.module'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Modules.name,
            schema: ModuleSchema
        }]),
        QuestionModule,
    ],
    controllers:[ModuleController],
    providers:[ModuleService],
    exports:[ModuleService]
})


export class ModuleModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticationMiddleware)
            .forRoutes(ModuleController);
    }
}
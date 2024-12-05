import { MiddlewareConsumer, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Progress, ProgressSchema } from 'src/schemas/progress.schema'
import { ProgressController } from './progress.controller'
import { ProgressService } from './progress.service'
import { AuthenticationMiddleware } from 'src/Auth/middleware/authentication.middleware'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Progress.name,
            schema: ProgressSchema
        }])
    ],
    controllers:[ProgressController],
    providers:[ProgressService]
})


export class ProgressModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticationMiddleware)
            .forRoutes(ProgressController);
    }
}
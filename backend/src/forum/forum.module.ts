import { MiddlewareConsumer, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Forum, ForumSchema } from 'src/schemas/forum.schema'
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { MessageModule } from 'src/message/message.module';
import { AuthenticationMiddleware } from 'src/Auth/middleware/authentication.middleware';

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Forum.name,
            schema: ForumSchema
        }]),
        MessageModule
    ],
    controllers:[ForumController],
    providers:[ForumService]
})


export class ForumModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticationMiddleware)
            .forRoutes(ForumController);
    }
}
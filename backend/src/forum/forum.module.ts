import { MiddlewareConsumer, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Forum, ForumSchema } from './model/forum.schema';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { MessageModule } from 'src/message/message.module';
import { AuthenticationMiddleware } from 'src/Auth/middleware/authentication.middleware';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Forum.name,
            schema: ForumSchema
        }]),
        MessageModule,
        NotificationModule
    ],
    controllers:[ForumController],
    providers:[ForumService]
})


export class ForumModule {}
import { MiddlewareConsumer, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Chat, ChatSchema } from './model/chat.schema'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'
import { AuthenticationMiddleware } from 'src/Auth/middleware/authentication.middleware'
import { UserModule } from 'src/user/user.module'
import { MessageModule } from 'src/message/message.module'
import { NotificationModule } from 'src/notification/notification.module'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Chat.name,
            schema: ChatSchema
        }]), UserModule, MessageModule, NotificationModule
    ],
    controllers:[ChatController],
    providers:[ChatService], 
    exports:[ChatService] 
})


export class ChatModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticationMiddleware)
            .forRoutes(ChatController);
    }
}
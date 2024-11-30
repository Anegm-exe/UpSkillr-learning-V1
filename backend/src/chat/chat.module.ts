import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Chat, ChatSchema } from 'src/schemas/chat.schema'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Chat.name,
            schema: ChatSchema
        }])
    ],
    controllers:[],
    providers:[]
})


export class ChatModule {}
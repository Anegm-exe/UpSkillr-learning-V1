import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Message, MessageSchema } from 'src/schemas/message.schema'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Message.name,
            schema: MessageSchema
        }])
    ],
    controllers:[],
    providers:[]
})


export class MessageModule {}
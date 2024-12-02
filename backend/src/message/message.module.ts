import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Message, MessageSchema } from 'src/schemas/message.schema'
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Message.name,
            schema: MessageSchema
        }])
    ],
    controllers:[MessageController],
    providers:[MessageService],
    exports:[MessageService]
})


export class MessageModule {}
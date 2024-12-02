import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Forum, ForumSchema } from 'src/schemas/forum.schema'
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { MessageModule } from 'src/message/message.module';

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


export class ForumModule {}
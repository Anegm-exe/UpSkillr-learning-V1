import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Forum, ForumSchema } from 'src/schemas/forum.schema'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Forum.name,
            schema: ForumSchema
        }])
    ],
    controllers:[],
    providers:[]
})


export class ForumModule {}
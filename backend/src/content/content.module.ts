import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Content, ContentSchema } from 'src/schemas/content.schema'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Content.name,
            schema: ContentSchema
        }])
    ],
    controllers:[],
    providers:[]
})


export class ContentModule {}
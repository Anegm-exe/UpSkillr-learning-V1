import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Content, ContentSchema } from 'src/schemas/content.schema'
import { ContentController } from './content.controller';
import { ContentService } from './content.service';

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Content.name,
            schema: ContentSchema
        }])
    ],
    controllers:[ContentController],
    providers:[ContentService]
})


export class ContentModule {}
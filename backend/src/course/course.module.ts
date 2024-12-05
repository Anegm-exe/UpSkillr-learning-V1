import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Course, CourseSchema } from 'src/schemas/course.schema'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Course.name,
            schema: CourseSchema
        }])
    ],
    controllers:[],
    providers:[]
})


export class CourseModule {}
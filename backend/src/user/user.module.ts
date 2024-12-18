import { MiddlewareConsumer, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/user/model/user.schema'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { AuthenticationMiddleware } from 'src/Auth/middleware/authentication.middleware'
import { CourseModule } from 'src/course/course.module'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema
        }]),
        CourseModule
    ],
    controllers:[UserController],
    providers:[UserService],
    exports:[UserService]
})


export class UserModule {}
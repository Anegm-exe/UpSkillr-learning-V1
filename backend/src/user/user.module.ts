import { MiddlewareConsumer, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/schemas/user.schema'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { AuthenticationMiddleware } from 'src/Auth/middleware/authentication.middleware'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema
        }])
    ],
    controllers:[UserController],
    providers:[UserService],
    exports:[UserService]
})


export class UserModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationMiddleware).forRoutes(UserController);
    }
}
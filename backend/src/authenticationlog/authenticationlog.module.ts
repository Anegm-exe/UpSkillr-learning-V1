import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthenticationLog, AuthenticationLogSchema } from 'src/schemas/authenticationLog.schema'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: AuthenticationLog.name,
            schema: AuthenticationLogSchema
        }])
    ],
    controllers:[],
    providers:[]
})


export class AuthenticationLogModule {}
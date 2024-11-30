import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Notification, NotificationSchema } from 'src/schemas/Notification.schema'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Notification.name,
            schema: NotificationSchema
        }])
    ],
    controllers:[],
    providers:[]
})


export class NotificationModule {}
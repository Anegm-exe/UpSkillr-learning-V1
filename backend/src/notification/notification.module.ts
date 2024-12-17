import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Notification, NotificationSchema } from 'src/notification/model/Notification.schema'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notifications.service'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Notification.name,
            schema: NotificationSchema
        }])
    ],
    controllers:[NotificationController],
    providers:[NotificationService],
    exports:[NotificationService]
})


export class NotificationModule {}
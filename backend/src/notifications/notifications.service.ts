import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { Notification,NotificationDocument} from 'src/schemas/Notification.schema';

@Injectable()
export class NotificationService {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,) { }
  // create a notification
  async create(notificationData: Notification): Promise<Notification> { 
    const notification = new this.notificationModel(notificationData); 
    return await notification.save(); 
  }

  //retrieve all notifications
  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().exec();
}
  //get notification by id
 async findOne(id: Types.ObjectId): Promise<Notification> {
    const notification = await this.notificationModel.findOne(id).exec();
    if (!notification) {
      throw new NotFoundException(`Notification with id #${id} not found`);
    }
    return notification;
  }

  //update notification
  async update(id: Types.ObjectId, updateData: Partial<Notification>): Promise<Notification> {
    const updatedNotification = await this.notificationModel
        .findOneAndUpdate({ _id: id }, updateData, { new: true })
        .exec();
    if (!updatedNotification) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return updatedNotification;
}
  //delete a notification
  async delete(id: Types.ObjectId): Promise<void> {
    const result = await this.notificationModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
        throw new NotFoundException(`Notification with ID ${id} not found`);
    }
}
}

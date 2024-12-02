import { Controller, Get, Post, Body, Patch, Param, Delete,Query } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { Notification } from 'src/schemas/Notification.schema';
import { Types } from 'mongoose';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationService) {}

  // Create a Notification
  @Post()
  async createNotification(@Body() notificationData: Notification): Promise<Notification> {
    return this.notificationsService.create(notificationData);
  }

  // Retrieve All Notifications
  @Get()
  async findAllNotifications(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  // Get Notification by ID
  @Get(':id')
  async findNotificationById(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.findOne((id));
  }

  // Update a Notification by ID
  @Patch(':id')
  async updateNotification(
    @Param('id') id: string, 
    @Body() updateData: Partial<Notification>
  ): Promise<Notification> {
    return this.notificationsService.update((id), updateData);
  }

  // Delete a Notification by ID
  @Delete(':id')
  async deleteNotification(@Param('id') id: string): Promise<void> {
    return this.notificationsService.delete((id));
  }
  @Delete()
  async removeExpiredNotifications(): Promise<void> {
    const deletedCount = await this.notificationsService.deleteExpiredNotifications();
    console.log(`Deleted ${deletedCount} expired notifications.`);
  }
}

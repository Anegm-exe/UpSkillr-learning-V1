import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { Notification } from 'src/notification/model/Notification.schema';
import { CreateNotificationDto, UpdateNotificationDto } from './dtos/notifications.dtos';
import { AuthGuard } from 'src/Auth/guards/authentication.guard';

@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationsService: NotificationService) {}

  // Create a Notification
  @Post()
  async createNotification(@Body() notificationData: CreateNotificationDto): Promise<Notification> {
    return this.notificationsService.create(notificationData);
  }

  // Retrieve All Notifications
  @Get()
  async findAllNotifications(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Get('user/:user_id')
  async getNotificationsByUser(@Param('user_id') user_id: string): Promise<Notification[]> {
    return this.notificationsService.findByUserId(user_id);
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
    @Body() updateData: UpdateNotificationDto
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
  }
}

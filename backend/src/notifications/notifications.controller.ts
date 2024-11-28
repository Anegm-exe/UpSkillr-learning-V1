import { Controller, Get, Post, Body, Patch, Param, Delete,Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';


@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

// Send Notification
@Post()
async sendNotification(@Body() data: any) {
  return this.notificationsService.sendNotification(data);
}

  // Receive All Notifications
  @Get()
  async receiveNotifications() {
    return this.notificationsService.receiveNotifications();
  }
  // View Past Notifications for a Specific User
  @Get('user/:userId')
  async viewPastNotifications(@Param('userId') userId: string) {
    return this.notificationsService.viewPastNotifications(userId);
  }
// Filter Notifications
@Get('filter')
async filterNotifications(
  @Query('date') date?: string,
  @Query('userId') userId?: string,
) {
  return this.notificationsService.filterNotifications(date, userId);
}
 // Update Notification
 @Patch(':id')
 async updateNotification(@Param('id') id: string, @Body() updateData: any) {
   return this.notificationsService.updateNotification(id, updateData);
 }

 // Delete Notification
 @Delete(':id')
 async deleteNotification(@Param('id') id: string) {
   return this.notificationsService.deleteNotification(id);
 }
}

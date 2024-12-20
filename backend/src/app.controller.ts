import { Controller, Post, UseGuards } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { Role, Roles } from './Auth/decorators/roles.decorator';
import { authorizationGuard } from './Auth/guards/authorization.guard';
import { AuthGuard } from './Auth/guards/authentication.guard';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Public } from './Auth/decorators/public.decorator';

@Roles(Role.Admin)
@UseGuards(authorizationGuard)
@UseGuards(AuthGuard)
@Controller()
export class AppController {
  private readonly mainDbUri = 'mongodb+srv://AbdelrahmanAhmed:2ZV4Schbo21korHV@maincluster.dch36.mongodb.net/UpSkillr';
  private readonly backupDbUri = 'mongodb://localhost:27017/backup-db';
  private readonly collectionsToBackup = ['users', 'progresses'];

  // Define the cron job for running every hour
  @Public()
  @Cron(CronExpression.EVERY_HOUR)
  async backupCollections() {
    try {
      const mainClient = await MongoClient.connect(this.mainDbUri);
      const backupClient = await MongoClient.connect(this.backupDbUri);

      const mainDb = mainClient.db();
      const backupDb = backupClient.db();

      for (const collectionName of this.collectionsToBackup) {
        // Get all documents from main collection
        const documents = await mainDb
          .collection(collectionName)
          .find({})
          .toArray();

        // Drop existing backup collection if exists
        await backupDb.collection(collectionName).drop().catch(() => {});

        // Insert documents into backup collection
        if (documents.length > 0) {
          await backupDb.collection(collectionName).insertMany(documents);
        }
      }

      await mainClient.close();
      await backupClient.close();

      console.log('Backup completed successfully');
    } catch (error) {
      console.error('Backup failed', error.message);
    }
  }

  @Post('backup')
  async manualBackup() {
    await this.backupCollections();
    return { success: true, message: 'Manual backup completed successfully' };
  }
}

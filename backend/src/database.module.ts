import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './schemas/message.schema';
import { UserSchema } from './schemas/user.schema';
import { CourseSchema } from './schemas/course.schema';
import { ModuleSchema } from './schemas/module.schema';
import { QuizSchema } from './schemas/quiz.schema';
import { ResponseSchema } from './schemas/response.schema';
import { ProgressSchema } from './schemas/progress.schema';
import { NoteSchema } from './schemas/note.schema';
import { AuthenticationLogSchema } from './schemas/authentication-logs.schema';
import { QuestionSchema } from './schemas/question.schema';
import { ChatSchema } from './schemas/chat.schema';
import { ContentSchema } from './schemas/content.schema';
import { NotificationSchema } from './schemas/notification.schema';
import { ForumSchema } from './schemas/forum.schema';

@Module({
    imports: [
        // Connect to MongoDB 
        MongooseModule.forRoot('mongodb+srv://AbdelrahmanAhmed:2ZV4Schbo21korHV@maincluster.dch36.mongodb.net/UpSkillr'), 

        MongooseModule.forFeature([
            { name: 'Message', schema: MessageSchema},
            { name: 'Question', schema: QuestionSchema },
            { name: 'User', schema: UserSchema },
            { name: 'Course', schema: CourseSchema },
            { name: 'Module', schema: ModuleSchema },
            { name: 'Quiz', schema: QuizSchema },
            { name: 'Response', schema: ResponseSchema },
            { name: 'Progress', schema: ProgressSchema },
            { name: 'Notes', schema: NoteSchema },
            { name: 'Chat', schema: ChatSchema},
            { name: 'AuthenticationLogs', schema: AuthenticationLogSchema },
            { name: 'Content', schema: ContentSchema },
            { name: 'Notification', schema: NotificationSchema },
            { name: 'Forum', schema: ForumSchema },
        ]),
    ],
    exports: [MongooseModule]
})
export class DatabaseModule { }

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { CourseSchema } from './schemas/courses.schema';
import { ModuleSchema } from './schemas/modules.schema';
import { QuizSchema } from './schemas/quizzes.schema';
import { ResponseSchema } from './schemas/responses.schema';
import { ProgressSchema } from './schemas/progress.schema';
import { NotesSchema } from './schemas/notes.schema';
import { AuthenticationLogsSchema } from './schemas/authentication-logs.schema';

@Module({
    imports: [
        // Connect to MongoDB 
        MongooseModule.forRoot('your-mongo-db-connection-string'), // (Actuall URL MISSING PLEASE CREATE AND ADD IT :D)

        // 8 Schemas Added Refrencing the "Schemas PDF"" submitted on the CMS! PLEASE CHECK IT OUT AGAIN AND SECOND GUESS ITS CONTENT!
        // CHATGPT HELPED IN FASTLY IMPLEMENTING THEM SO CHANGE AND DISCUSS IT AS MUCH AS YOU LIKE! :D (Good Base To Start)
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema },                               // Register The UserSchema
            { name: 'Course', schema: CourseSchema },                           // Register the CourseSchema
            { name: 'Module', schema: ModuleSchema },                           // Register the ModuleSchema
            { name: 'Quiz', schema: QuizSchema },                               // Register QuizSchema
            { name: 'Response', schema: ResponseSchema },                       // Register ResponseSchema
            { name: 'Progress', schema: ProgressSchema },                       // Register ProgressSchema
            { name: 'Notes', schema: NotesSchema },                             // Register NotesSchema
            { name: 'AuthenticationLogs', schema: AuthenticationLogsSchema },   // Register AuthenticationLogsSchema
        ]),
    ],
})
export class DatabaseModule { }

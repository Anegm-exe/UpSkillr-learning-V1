import { MongooseModule } from "@nestjs/mongoose";
import { ProgressModule } from "./progress/progress.module";
import { QuizModule } from "./quiz/quiz.module";
import { QuestionModule } from "./question/question.module";
import { ResponseModule } from "./response/response.module";
import { MessageModule } from "./message/message.module";
import { UserModule } from "./user/user.module";
import { CourseModule } from "./course/course.module";
import { ModuleModule } from "./module/module.module";
import { NoteModule } from "./note/note.module";
import { ChatModule } from "./chat/chat.module";
import { AuthenticationLogModule } from "./authenticationlog/authenticationlog.module";
import { ContentModule } from "./content/content.module";
import { NotificationModule } from "./notification/notification.module";
import { ForumModule } from "./forum/forum.module";
import { AuthModule } from "./Auth/auth.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://AbdelrahmanAhmed:2ZV4Schbo21korHV@maincluster.dch36.mongodb.net/UpSkillr"), //mongodb+srv://AbdelrahmanAhmed:2ZV4Schbo21korHV@maincluster.dch36.mongodb.net/UpSkillr
    // MongooseModule.forRoot("mongodb://localhost:27017"),
    MessageModule,
    QuizModule,
    QuestionModule,
    ResponseModule,
    ProgressModule,
    UserModule,
    CourseModule,
    ModuleModule,
    NoteModule,
    ChatModule,
    AuthenticationLogModule,
    ContentModule,
    NotificationModule,
    ForumModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}

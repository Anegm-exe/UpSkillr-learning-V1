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
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER } from '@nestjs/core';
import { UnauthorizedExceptionFilter } from "./Auth/middleware/UnauthorizedExceptionFilter";
import { AppController } from "./app.controller";
import { AuthenticationMiddleware } from "./Auth/middleware/authentication.middleware";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://AbdelrahmanAhmed:2ZV4Schbo21korHV@maincluster.dch36.mongodb.net/UpSkillr"),
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
  providers: [
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    }
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
        .apply(AuthenticationMiddleware)
        .forRoutes(AppController);
  }
}

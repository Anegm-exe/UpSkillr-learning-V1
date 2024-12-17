import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Note, NoteSchema } from "src/note/model/note.schema";
import { NoteController } from "./note.controller";
import { NoteService } from "./note.service";
import { NotificationModule } from "src/notification/notification.module";
import { AuthenticationMiddleware } from "src/Auth/middleware/authentication.middleware";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Note.name,
        schema: NoteSchema,
      },
    ]),
    NotificationModule
  ],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthenticationMiddleware)
            .forRoutes(NoteController);
    }
}

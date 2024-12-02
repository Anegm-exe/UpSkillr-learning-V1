import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Note, NoteSchema } from "src/schemas/note.schema";
import { NoteController } from "./note.controller";
import { NoteService } from "./note.service";
import { NotificationModule } from "src/notification/notification.module";

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
export class NoteModule {}

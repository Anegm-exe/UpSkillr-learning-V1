import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Content, ContentSchema, FileVersion, FileVersionSchema } from "src/schemas/content.schema";
import { ContentController } from "./content.controller";
import { ContentService } from "./content.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Content.name, schema: ContentSchema },
      { name: FileVersion.name, schema: FileVersionSchema },
    ]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}

import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Content, ContentSchema, FileVersion, FileVersionSchema } from "src/schemas/content.schema";
import { ContentController } from "./content.controller";
import { ContentService } from "./content.service";
import { AuthenticationMiddleware } from "src/Auth/middleware/authentication.middleware";

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
export class ContentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(ContentController);
  }
}

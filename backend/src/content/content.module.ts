import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Content, ContentSchema, FileVersion, FileVersionSchema } from "src/content/model/Content.schema";
import { ContentController } from "./content.controller";
import { ContentService } from "./content.service";
import { AuthenticationMiddleware } from "src/Auth/middleware/authentication.middleware";
import { ModuleModule } from "src/module/module.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Content.name, schema: ContentSchema },
      { name: FileVersion.name, schema: FileVersionSchema },
    ]),
    ModuleModule
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(ContentController);
  }
}

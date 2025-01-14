import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Modules, ModuleSchema } from "src/module/model/module.schema";
import { ModuleController } from "./module.controller";
import { ModuleService } from "./module.service";
import { QuestionModule } from "src/question/question.module";
import { ProgressModule } from "src/progress/progress.module";
import { ResponseModule } from "src/response/response.module";
import { Questions, QuestionsSchema } from "src/question/model/question.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Modules.name,
        schema: ModuleSchema,
      },
      {
        name: Questions.name,
        schema: QuestionsSchema,
      },
    ]),
    QuestionModule,
    ProgressModule,
    ResponseModule,
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
  exports: [ModuleService],
})
export class ModuleModule {}

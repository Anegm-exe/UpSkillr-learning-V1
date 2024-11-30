import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Response, ResponseSchema } from "src/schemas/response.schema";
import { ResponseController } from "./response.controller";
import { ResponseService } from "./response.service";
import { QuestionService } from "src/question/question.service";
import { QuestionModule } from "src/question/question.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Response.name,
        schema: ResponseSchema,
      },
    ]),
    QuestionModule,
  ],
  controllers: [ResponseController],
  providers: [ResponseService],
})
export class ResponseModule {}

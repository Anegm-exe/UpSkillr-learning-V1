import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Response, ResponseSchema } from "src/response/model/response.schema";
import { ResponseController } from "./response.controller";
import { ResponseService } from "./response.service";
import { AuthenticationMiddleware } from "src/Auth/middleware/authentication.middleware";
import { QuizModule } from "src/quiz/quiz.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Response.name,
        schema: ResponseSchema,
      },
    ]),
    QuizModule,
  ],
  controllers: [ResponseController],
  providers: [ResponseService],
  exports: [ResponseService]
})
export class ResponseModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes(ResponseController);
  }
}

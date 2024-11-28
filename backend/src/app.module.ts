import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';  // Import the DatabaseModule
import { QuizService } from './services/quiz.service';
import { QuizController } from './controllers/quiz.controller';
import { ResponseController } from './controllers/response.controller';
import { ProgressController } from './controllers/progress.controller';
import { ProgressService } from './services/progress.service';
import { ResponseService } from './services/response.service';
import { QuestionService } from './services/question.service';
import { QuestionController } from './controllers/question.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [QuizController, ResponseController, ProgressController, QuestionController],
  providers: [QuizService, ProgressService, ResponseService, QuestionService],
})
export class AppModule {}

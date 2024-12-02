import { UpdateQuestionDto } from "src/question/dtos/question.dto";

export class CreateQuizDto {
    module_id: string;
    questions: string[];
}

export class UpdateQuizDto {
    module_id?: string;
    questions?: {question_id: string, question:UpdateQuestionDto}[];
}
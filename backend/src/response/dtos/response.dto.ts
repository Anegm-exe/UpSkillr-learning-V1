export class CreateResponseDto {
    user_id: string;
    quiz_id: string;
    answers: {question_id: string; answer: number}[];
    correctAnswers?: {question_id: string; answer: number}[]
    score?: number;
}

export class UpdatedResponseDto {
    answers?: {questionId: string; answer: number}[];
    score?: number;
}
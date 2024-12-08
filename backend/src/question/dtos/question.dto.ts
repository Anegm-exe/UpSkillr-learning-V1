export class CreateQuestionDto {
    title: string;
    options: string[];
    answer: number;
    difficulty: string;
    type: string;
}

export class UpdateQuestionDto {
    title?: string;
    options?: string[];
    answer?: number;
    difficulty?: string;
    type?: string;
}
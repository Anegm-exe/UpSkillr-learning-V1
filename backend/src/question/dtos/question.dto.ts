export class CreateQuestionDto {
    title: string;
    options: string[];
    answer: number;
}

export class UpdateQuestionDto {
    title?: string;
    options?: string[];
    answer?: number;
}
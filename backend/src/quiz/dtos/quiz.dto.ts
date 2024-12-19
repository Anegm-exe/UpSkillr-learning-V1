export class CreateQuizDto {
    user_id:string;
    questions: string[];
    type: string;
    module_id:string;
}

export class UpdateQuizDto {
    user_id?: string;
    type?: string;
    questions?: string[];
}
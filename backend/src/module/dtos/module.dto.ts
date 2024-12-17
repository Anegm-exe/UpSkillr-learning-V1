export class CreateModuleDto {
    course_id?: string;
    title: string;
    difficulty: string;
    no_question: number;
    type: string;
    resources?: string[];  
    content_ids?: string[];
}

export class UpdateModuleDto {
    title?: string;
    difficulty?: string; 
    no_question?: number;
    type?: string;
    resources?: string[];  
    content_ids?: string[];
}
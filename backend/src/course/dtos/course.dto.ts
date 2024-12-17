export class CreateCourseDto {
    title:string;
    description: string;
    category: string;
    difficulty_Level: string;
}

export class UpdateCourseDto {
    title?:string;
    description?: string;
    category?: string;
    difficulty_Level?: string;
}
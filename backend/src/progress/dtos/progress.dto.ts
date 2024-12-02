export class CreateProgressDto {
    user_id: string;
    course_id: string;
}

export class UpdateProgressDto {
  completion_percentage?: number;
  last_accessed?: Date;
  average_quiz?: number;
  opened_times?: number;
}

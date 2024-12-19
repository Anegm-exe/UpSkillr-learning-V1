export class CreateForumDto {
  course_id: string;
  user_id?: string;
  title: string;
}

export class UpdateForumDto {
    course_id?: string;
    title?: string;
}
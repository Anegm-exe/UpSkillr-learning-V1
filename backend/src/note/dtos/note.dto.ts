export class CreateNoteDto {
    user_id: string;
  content:string;
  course_id?:string;

}

export class UpdateNoteDto {
    user_id?: string;
    content?:string;
    course_id?:string;
}
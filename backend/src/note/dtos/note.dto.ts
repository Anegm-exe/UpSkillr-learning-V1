export class CreateNoteDto {
  user_id: string;
  content:string;
  module_id:string;
}

export class UpdateNoteDto {
  user_id?: string;
  content?:string;
  module_id?:string;
}
export class CreateNotificationDto {
  user_ids: string[];
  message:string;
  sender_id?:string;

}

export class UpdateNotificationDto {
    user_ids?: string[];
    message?:string;
    sender_id?:string;
}
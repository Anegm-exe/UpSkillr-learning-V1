export class CreateNotificationDto {
    user_id: string;
  message:string;
  sender_id?:string;

}

export class UpdateNotificationDto {
    user_id?: string;
    message?:string;
    sender_id?:string;
}
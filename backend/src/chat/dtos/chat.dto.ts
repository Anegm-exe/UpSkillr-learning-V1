import { IsString, IsNotEmpty, IsArray, IsOptional, ValidateNested, MaxLength, IsDate } from "class-validator";
import { Type } from 'class-transformer';

export class CreateMessageDTO {
    @IsString()
    @IsNotEmpty()
    message_id: string;

    @IsString()
    @IsNotEmpty()
    chat_id: string;

    @IsString()
    @MaxLength(3000)
    @IsOptional()
    text?: string;

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsDate()
    @IsOptional()
    createdAt?: Date;

    @IsDate()
    @IsOptional()
    updatedAt?: Date;

    @IsDate()
    @IsOptional()
    deletedAt?: Date;
}
export class CreateChatDTO {
    @IsString()
    @IsNotEmpty()
    admin_id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    user_ids?: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateMessageDTO)
    @IsOptional()
    messages?: CreateMessageDTO[];
}
export class GetChatDetailsDTO {
    @IsString()
    @IsNotEmpty()
    chat_id: string;

}
export class GetAllChatsDTO {
    @IsString()
    @IsNotEmpty()
    User_Id: string;
}
export class GetRecentChatDTO {
    @IsString()
    @IsNotEmpty()
    User_Id: string;
}
export class EditMessagesDTO {
    @IsString()
    @IsNotEmpty()
    message_id: string;

    @IsString()
    @IsNotEmpty()
    chat_id: string;

    @IsString()
    @IsNotEmpty()
    newText?: string;

}
export class DeleteMessageDTO {
    @IsString()
    @IsNotEmpty()
    message_id: string;

    @IsString()
    @IsNotEmpty()
    chat_id: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    deleted_at:Date;


    @IsString()
    @IsNotEmpty()
    deletedBy: string;
}
export class UpdateChatDTO{
@IsString()
@IsNotEmpty()
add_users?: string[]; 
remove_users?:string[];
}
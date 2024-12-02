import { IsString, IsNotEmpty,  IsOptional, MaxLength, IsDate } from "class-validator";

export class CreateMessageDTO {
    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    repliedTo_id?: string;

    @IsString()
    @MaxLength(3000)
    @IsOptional()
    text: string;

}

export class UpdateMessageDTO {
    @IsOptional()
    @IsString()
    text: string;
  
    @IsOptional()
    @IsString()
    user_id: string;
  }
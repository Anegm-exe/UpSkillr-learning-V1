import { IsString, IsNotEmpty, IsOptional, MaxLength } from "class-validator";

export class CreateMessageDTO {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  repliedTo_id?: string;

  @IsString()
  @MaxLength(3000)
  text: string;
}

export class UpdateMessageDTO {
  @IsOptional()
  @IsString()
  text: string;
}

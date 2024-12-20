import { IsArray, IsBoolean, IsEnum, IsMongoId, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateCourseDto {
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  instructor_ids?: string[]; 
  
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  isArchived?: boolean;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(['Beginner', 'Intermediate', 'Advanced'])
  @IsOptional()
  difficulty_Level?: string;

  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @IsOptional()
  timestamp?: Date;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  students?: string[]; // array of student IDs

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  modules?: string[]; // array of module IDs

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  quizzes?: string[]; // array of quiz IDs

}

import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsString, Max, Min } from 'class-validator';

//ISmongoID makes sure the items are valid mongo ids

export class CreateCourseDto {
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  instructor_ids: string[]; 
  
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(['Beginner', 'Intermediate', 'Advanced'])
  @IsNotEmpty()
  difficulty_Level: string;

  @Min(0)
  @Max(5)
  rating: number;

  timestamp: Date;

  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  students: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  modules: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  quizzes: string[]; 
}

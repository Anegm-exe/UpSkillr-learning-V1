import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response, ResponseDocument } from './model/response.schema';
import { CreateResponseDto, UpdatedResponseDto } from './dtos/response.dto';
import { QuizService } from 'src/quiz/quiz.service';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(Response.name) private responseModel: Model<ResponseDocument>, 
    private readonly quizService: QuizService,
  ) {}

    // Create A Response With The Data Provided
    async create(response: CreateResponseDto): Promise<Response> {
      const answers = await this.quizService.getAnswers(response.quiz_id);
      response.correctAnswers = answers;
      let score = 0;
      for (const answerResponse of response.answers) {      
        // find answer in correctAnswer
        const correctAnswer = answers.find((answer) => answer.question_id === answerResponse.question_id)
          if (answerResponse.answer === correctAnswer.answer) {
            score ++;
          }
      }
      response.score = score/response.answers.length;
      const newResponse = new this.responseModel(response);
      return await newResponse.save();
    }
    
  // Get All Responses Existing
  async findAll(): Promise<Response[]> {
    return this.responseModel.find().exec();
  }

  async findAllByQuizId(id: string): Promise<Response[]> {
    const response = await this.responseModel.find({ quiz_id: id }).exec();
    if (!response) {
      throw new NotFoundException(`Responses with quiz_id ${id} not found`);
    }
    return response;
  }

  async findAllByUserId(id: string): Promise<Response[]> {
    const response = await this.responseModel.find({ user_id: id }).exec();
    if (!response) {
      throw new NotFoundException(`Responses with user_id ${id} not found`);
    }
    return response;
  }

  // Find A Specific Response by ID
  async findOne(id: string): Promise<Response> {
    const response = await this.responseModel.findOne({ _id: id }).exec();
    if (!response) {
      throw new NotFoundException(`Response with ID ${id} not found`);
    }
    return response;
  }

    // Update A Response Based On New-Data
    async update(id: string, updateData: UpdatedResponseDto): Promise<Response> {
        const updatedResponse = await this.responseModel
            .findOneAndUpdate({ _id: id }, updateData, { new: true })
            .exec();
        if (!updatedResponse) {
            throw new NotFoundException(`Response with ID ${id} not found`);
        }
        return updatedResponse;
    }

  // Delete A Response
  async delete(response_id: string): Promise<void> {
    const response = await this.responseModel.findById({_id:response_id});
    if (!response) {
        throw new NotFoundException(`Response with ID ${response_id} not found`);
    }

    // Delete the response and associated quiz (if applicable)
    await this.quizService.delete(response.quiz_id);
    await this.responseModel.findByIdAndDelete({_id:response_id});
  }

  // find by quiz and user
  async findByQuizAndUser(quizId: string, userId: string): Promise<Response | null> {
    return this.responseModel.findOne({ quiz_id: quizId, user_id: userId }).exec();
  }  


}

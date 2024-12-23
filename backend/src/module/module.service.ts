import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ModuleDocument, Modules } from "./model/module.schema";
import { CreateModuleDto, UpdateModuleDto } from "./dtos/module.dto";
import { CreateQuestionDto } from "src/question/dtos/question.dto";
import { QuestionService } from "src/question/question.service";
import { NotificationService } from "src/notification/notifications.service";
import { Request } from "express";
import { ProgressService } from "src/progress/progress.service";
import { ResponseService } from "src/response/response.service";
import { Questions, QuestionsDocument } from "src/question/model/question.schema";

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(Modules.name) private moduleModel: Model<ModuleDocument>,
    @InjectModel(Questions.name) private questionModel: Model<QuestionsDocument>,
    private readonly questionService: QuestionService,
    private readonly progressService: ProgressService,
    private readonly responseService: ResponseService
  ) {}

  // Find all modules
  async findAll(): Promise<Modules[]> {
    return this.moduleModel.find().exec();
  }

  // Find all Modules by course
  async findAllByCourse(course_id: string, req: Request): Promise<Modules[]> {
    const modules = await this.moduleModel.find({ course_id }).exec();
    if (req["user"].role !== "student") {
      return modules;
    }

    const progress = await this.progressService.findByUserAndCourse(req["user"].userid, course_id);
    if (!progress) {
      throw new UnauthorizedException("You are not enrolled in this course");
    }

    let filterModules = [];
    if (!progress.average_quiz || progress.average_quiz >= 0.75) {
      filterModules = modules;
    } else if (progress.average_quiz >= 0.5) {
      filterModules = modules.filter((module) => module.difficulty !== "hard");
    } else {
      filterModules = modules.filter((module) => module.difficulty !== "medium" && module.difficulty !== "hard");
    }
    return filterModules;
  }

  // Find all Modules by course (Instructor view)
  async findAllByCourseInstructor(course_id: string): Promise<Modules[]> {
    const modules = await this.moduleModel.find({ course_id }).exec();
    if (!modules) {
      throw new NotFoundException("No modules found for this course");
    }
    return modules;
  }

  // Create a new module
  async create(CreateModuleDto: CreateModuleDto, course_id: string): Promise<Modules> {
    CreateModuleDto.course_id = course_id;
    const newModule = new this.moduleModel(CreateModuleDto);
    return newModule.save();
  }

  // Update the module
  async updateModule(moduleId: string, updateModuleDto: UpdateModuleDto): Promise<Modules> {
    const updatedModule = await this.moduleModel.findByIdAndUpdate(moduleId, updateModuleDto, { new: true }).exec();
    if (!updatedModule) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }
    return updatedModule;
  }

  // Delete a module
  async delete(moduleId: string): Promise<void> {
    const deletedModule = await this.moduleModel.findByIdAndDelete(moduleId).exec();
    if (!deletedModule) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }
  }

  // Find module by id
  async findOne(moduleId: string): Promise<Modules> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }
    return module;
  }

  // Add questions to the module
  async addQuestion(moduleId: string, question: CreateQuestionDto[]): Promise<Modules> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }

    const newQuestions = await this.questionService.createMany(question);
    newQuestions.forEach((question) => {
      module.question_bank.push(question._id);
    });

    return module.save();
  }

  // Delete question from module
  async deleteQuestion(moduleId: string, questionId: string): Promise<Modules> {
    // First find the module
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }

    // Remove question from question_bank array
    module.question_bank = module.question_bank.filter((qId) => qId.toString() !== questionId);

    // Delete the question document
    await this.questionModel.findByIdAndDelete(questionId).exec();

    // Save module changes
    const updatedModule = await module.save();

    return updatedModule;
  }

  // Add quizzes to the module
  async addQuizzes(moduleId: string, quizzes: string[]): Promise<Modules> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }
    module.quizzes = quizzes;
    return module.save();
  }

  async findAllByCourseIntructor(course_id: string): Promise<Modules[]> {
    const modules = await this.moduleModel.find({ course_id: course_id });
    if (!modules) {
      throw new NotFoundException("No modules found for this course");
    }
    return modules;
  }

  // Rate a module
  async rateModule(moduleId: string, rating: number): Promise<Modules> {
    const updatedModule = await this.moduleModel.findByIdAndUpdate({ _id: moduleId }, { $push: { ratings: rating } }, { new: true });
    if (!updatedModule) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }
    return updatedModule;
  }

  // Delete quizzes from module
  async deleteQuizzes(moduleId: string): Promise<Modules> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }

    // Check if any student has already solved the quizzes
    await Promise.all(
      module.quizzes.map(async (quizId) => {
        const response = await this.responseService.findByQuizId(quizId);
        if (response) {
          throw new ConflictException("Cannot delete quiz because it has been solved by a student");
        }
      })
    );

    module.quizzes = [];
    return module.save();
  }

  // Delete specific quiz from module
  async deleteQuiz(moduleId: string, quiz_id: string): Promise<Modules> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }

    if (!module.quizzes.includes(quiz_id)) {
      throw new ConflictException("Quiz not found in module");
    }

    module.quizzes = module.quizzes.filter((quiz) => quiz !== quiz_id);
    return module.save();
  }

  // Add content to module
  async addContent(moduleId: string, content: string): Promise<Modules> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }
    module.content_ids.push(content);
    return module.save();
  }

  // Delete content from module
  async deleteContent(moduleId: string, contentId: string): Promise<Modules> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found`);
    }

    if (!module.content_ids.includes(contentId)) {
      throw new NotFoundException(`Content with ID ${contentId} not found in module`);
    }

    module.content_ids = module.content_ids.filter((id) => id !== contentId);
    return module.save();
  }
}

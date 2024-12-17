import { BadRequestException, Injectable, NotFoundException, Req, UnauthorizedException } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ModuleDocument, Modules } from "./model/module.schema";
import { CreateModuleDto, UpdateModuleDto } from "./dtos/module.dto";
import { CreateQuestionDto } from "src/question/dtos/question.dto";
import { QuestionService } from "src/question/question.service";
import { NotificationService } from "src/notification/notifications.service";


@Injectable()
export class ModuleService {
    constructor(
        @InjectModel(Modules.name) private moduleModel: Model<ModuleDocument>,
        private readonly questionService: QuestionService,
    ) {}
    
    // Find all modules
    async findAll(): Promise<Modules[]> {
        return await this.moduleModel.find().exec();
    }

    // Find all Modules by course
    async findAllByCourse(course_id: string) : Promise<Modules[]> {
        return await this.moduleModel.find({course_id:course_id});
    }

    // Create a new module
    async create(CreateModuleDto: CreateModuleDto, course_id: string): Promise<Modules> {
        CreateModuleDto.course_id = course_id;
        const newModule = new this.moduleModel(CreateModuleDto);
        return newModule.save();
    }
        
    // Update the module
    async updateModule(moduleId: string, updateModuleDto: UpdateModuleDto): Promise<Modules> {
        const updatedModule = await this.moduleModel
            .findByIdAndUpdate(moduleId, updateModuleDto, { new: true })
            .exec();
        if (!updatedModule) {
            throw new NotFoundException(`Module with ID ${moduleId} not found`);
        }
        return updatedModule;
    }

    // Delete a module
    async delete(moduleId: string): Promise<void> {
        const deletedModule = await this.moduleModel.findByIdAndDelete({ _id: moduleId}).exec();
        if (!deletedModule) {
            throw new NotFoundException(`Module with ID ${moduleId} not found`);
        }
    }

    // Find module by id
    async findOne(moduleId: string): Promise<Modules> {
        const Module = await this.moduleModel.findOne({ _id: moduleId }).exec();
        if (!Module) {
            throw new NotFoundException(`Module with ID ${moduleId} not found`);
        }
        return Module
    }
    async addQuestion(moduleId: string, question: CreateQuestionDto[]): Promise<Modules> {
        const module = await this.moduleModel.findById(moduleId).exec()
        if (!module) {
            throw new NotFoundException(`Module with ID ${moduleId} not found`)
        }
        const newQuestions = await this.questionService.createMany(question);
        // add all questions
        newQuestions.map(question => {
            module.question_bank.push(question._id);
        })
        return module.save();
    }

    // add all quizzes
    async addQuizzes(moduleId: string, quizzes: string[]): Promise<Modules> {
        const module = await this.moduleModel.findById(moduleId).exec()
        if (!module) {
            throw new NotFoundException(`Module with ID ${moduleId} not found`)
        }
        module.quizzes = quizzes;
        return module.save();
    }
    // deleteQuiz
    async deleteQuiz(moduleId: string, quizId: string): Promise<Modules> {
        const module = await this.moduleModel.findById(moduleId).exec()
        if (!module) {
            throw new NotFoundException(`Module with ID ${moduleId} not found`);
        }
        module.quizzes = module.quizzes.filter(quiz => quiz !== quizId);
        return module.save();
    }

    async addContent(moduleId: string, content: string): Promise<Modules> {
        const module = await this.moduleModel.findById(moduleId).exec();
        if (!module) {
            throw new NotFoundException(`Module with ID ${moduleId} not found`)
        }
        module.content_ids.push(content)
        return module.save()
    }

    async deleteContent(moduleId: string, contentId: string): Promise<Modules> {
        const module = await this.moduleModel.findById(moduleId).exec()
        if (!module) {
            throw new NotFoundException(`Module with ID ${moduleId} not found`)
        }
        if (!module.content_ids.includes(contentId)) {
            throw new NotFoundException(`Content with ID ${contentId} not found in module`)
        }
        module.content_ids = module.content_ids.filter(id => id !== contentId)
        return module.save()
    }
}
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, isValidObjectId } from "mongoose";
import { CreateContentDto } from "src/content/dto/createContent.dto";
import { UpdateContentDto } from "src/content/dto/updateContent.dto";
import { Content, ContentDocument, FileVersion, FileVersionDocument } from "src/content/model/Content.schema";
import * as fs from "fs";
import * as path from "path";
import { existsSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import { Role } from "src/Auth/decorators/roles.decorator";
import { ModuleService } from "src/module/module.service";
@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
    @InjectModel(FileVersion.name) private fileVersionModel: Model<FileVersionDocument>,
    private readonly moduleService: ModuleService
  ) {}

  async getAllContent() {
    return await this.contentModel.find().exec();
  }

  async getFilePath(fileId: string): Promise<{ filePath: string; fileType: string }> {
    const file = await this.fileVersionModel.findById(fileId).exec();

    if (!file) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    const filePath = path.join(process.cwd(), file.url);
    const fileType = file.fileType;
    if (!existsSync(filePath)) {
      throw new NotFoundException(`File not found on the server`);
    }

    return { filePath, fileType };
  }

  //yet to add and check if student can access content, maybe by adding course id to content
  async getContentById(contentId: string, userRole: Role) {
    if (!isValidObjectId(contentId)) {
      throw new NotFoundException(`Invalid ID format: ${contentId}`);
    }
    const content = await this.contentModel.findById(contentId).populate("versions").exec();
    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }
    if (userRole === Role.Student) {
      const { versions: _, ...contentWithoutVersions } = content.toObject();
      return contentWithoutVersions;
    }
    return content;
  }

  async uploadContent(createContentDto: CreateContentDto, file: Express.Multer.File, module_id: string) {
    const uploadDir = "./uploads";
    const fileName = `${uuidv4()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const newFileVersion = new this.fileVersionModel({
      title: createContentDto.title,
      url: filePath,
      desc: createContentDto.desc,
      createdAt: new Date(),
      fileType: file.mimetype,
    });

    await newFileVersion.save();

    const newContent = new this.contentModel({
      title: createContentDto.title,
      currentVersion: newFileVersion._id,
      versions: [newFileVersion._id],
    });
    await newContent.save();
    await this.moduleService.addContent(module_id, newContent._id);
    return {
      newContent,
      url: filePath,
      fileType: file.mimetype,
    };
  }

  async updateContent(contentId: string, updateContentDto: UpdateContentDto, file?: Express.Multer.File) {
    const content = await this.contentModel.findById(contentId).exec();
    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }

    let newFileVersion;
    if (file) {
      const uploadDir = "./uploads";
      const fileName = `${uuidv4()}-${file.originalname}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);

      newFileVersion = new this.fileVersionModel({
        title: updateContentDto.title || content.title,
        url: filePath,
        desc: updateContentDto.desc || "",
        createdAt: new Date(),
        fileType: file.mimetype,
      });

      await newFileVersion.save();
      content.versions.push(newFileVersion._id as any);
      content.currentVersion = newFileVersion._id as any;
    }
    console.log(updateContentDto.title);
    if (updateContentDto.title) {
      content.title = updateContentDto.title;
    }

    await content.save();
    const updatedContent = await this.contentModel.findById(contentId).populate("versions").exec();

    return {
      updatedContent,
      url: newFileVersion ? newFileVersion.url : undefined,
      fileType: file.mimetype,
    };
  }

  async deleteContent(contentId: string, module_id: string) {
    const content = await this.contentModel.findById(contentId).exec();
    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }

    for (const versionId of content.versions) {
      const fileVersion = await this.fileVersionModel.findById(versionId).exec();
      if (fileVersion) {
        const filePath = fileVersion.url;
        if (fs.existsSync(filePath)) {
          //unlink deletes the file from the directory
          fs.unlinkSync(filePath);
        }
        await this.fileVersionModel.findByIdAndDelete(versionId).exec();
      }
    }
    this.moduleService.deleteContent(module_id, contentId);
    await this.contentModel.findByIdAndDelete(contentId).exec();

    return { message: "Content and associated file versions deleted successfully" };
  }
}

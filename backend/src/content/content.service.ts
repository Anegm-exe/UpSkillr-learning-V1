import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, isValidObjectId } from "mongoose";
import { CreateContentDto } from "src/dto/createContent.dto";
import { UpdateContentDto } from "src/dto/updateContent.dto";
import { Content, ContentDocument, FileVersion, FileVersionDocument } from "src/schemas/content.schema";
import * as fs from "fs";
import * as path from "path";
import { existsSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import { Role } from "src/Auth/decorators/roles.decorator";
@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
    @InjectModel(FileVersion.name) private fileVersionModel: Model<FileVersionDocument>
  ) {}

  async getAllContent() {
    return await this.contentModel.find().exec();
  }

  async getFilePath(fileId: string): Promise<string> {
    const file = await this.fileVersionModel.findById(fileId).exec();

    if (!file) {
      throw new NotFoundException(`File with ID ${fileId} not found`);
    }

    const filePath = path.join(process.cwd(), file.url);
    if (!existsSync(filePath)) {
      throw new NotFoundException(`File not found on the server`);
    }

    return filePath;
  }

  //yet to add and check if student can access content, maybe by adding course id to content
  async getContentById(contentId: string, userRole: Role) {
    if (!isValidObjectId(contentId)) {
      throw new NotFoundException(`Invalid ID format: ${contentId}`);
    }
    const content = await this.contentModel.findById(contentId).exec();
    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }
    if (userRole === Role.Student) {
      content.versions = content[content.versions.length - 1];
    }
    return content;
  }

  async uploadContent(createContentDto: CreateContentDto, file: Express.Multer.File) {
    const uploadDir = "./uploads";
    const fileName = `${uuidv4()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const newFileVersion = new this.fileVersionModel({
      title: createContentDto.title,
      url: filePath,
      desc: createContentDto.desc,
      createdAt: new Date(),
    });

    await newFileVersion.save();

    const newContent = new this.contentModel({
      title: createContentDto.title,
      currentVersion: newFileVersion._id,
      versions: [newFileVersion._id],
    });
    await newContent.save();
    return {
      newContent,
      url: filePath,
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
      });

      await newFileVersion.save();
      console.log(newFileVersion);
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
    };
  }

  async deleteContent(contentId: string) {
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

    await this.contentModel.findByIdAndDelete(contentId).exec();

    return { message: "Content and associated file versions deleted successfully" };
  }
}

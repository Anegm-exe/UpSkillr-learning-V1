import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateContentDto } from "src/dto/createContent.dto";
import { UpdateContentDto } from "src/dto/updateContent.dto";
import { Content, ContentDocument, FileVersion, FileVersionDocument } from "src/schemas/content.schema";
import * as fs from "fs";
import * as path from "path";
import { v4 as uuidv4 } from "uuid";
@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
    @InjectModel(FileVersion.name) private fileVersionModel: Model<FileVersionDocument>
  ) {}

  async getAllContent() {
    return await this.contentModel.find().exec();
  }

  //yet to add and check if student can access content, maybe by adding course id to content
  async getContentById(contentId: string) {
    return await this.contentModel.findById(contentId).exec();
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

  async updateContent(contentId: string, updateContentDto: UpdateContentDto, file: Express.Multer.File) {
    const content = await this.contentModel.findById(contentId).exec();
    if (!content) {
      throw new NotFoundException(`Content with ID ${contentId} not found`);
    }

    const uploadDir = "./uploads";
    const fileName = `${uuidv4()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const newFileVersion = new this.fileVersionModel({
      title: updateContentDto.title,
      url: filePath,
      desc: updateContentDto.desc,
      createdAt: new Date(),
    });

    await newFileVersion.save();

    content.versions.push(newFileVersion._id as any);
    content.currentVersion = newFileVersion._id as any;

    await content.save();

    return {
      updatedContent: content,
      url: filePath,
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

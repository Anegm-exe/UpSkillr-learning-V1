import { Injectable } from "@nestjs/common";
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

  getAllContent() {
    //
  }

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

  updateContent(contentId: string, updateContentDto: UpdateContentDto) {
    //
  }

  deleteContent(contentId: string) {
    //
  }
}

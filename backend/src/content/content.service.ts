import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateContentDto } from "src/dto/createContent.dto";
import { UpdateContentDto } from "src/dto/updateContent.dto";
import { ContentDocument } from "src/schemas/content.schema";
@Injectable()
export class ContentService {
  constructor(@InjectModel(Response.name) private contentModel: Model<ContentDocument>) {}

  getAllContent() {
    //
  }

  getContentById(contentId: string) {
    //
  }

  uploadContent(createContentDto: CreateContentDto) {
    //have to include multer here
    //first create new file version object and add file to a local directory
    //then create a new content object taking the file from the file version title attribute
    // (may not need title at the end)
  }

  updateContent(contentId: string, updateContentDto: UpdateContentDto) {
    //
  }

  deleteContent(contentId: string) {
    //
  }
}

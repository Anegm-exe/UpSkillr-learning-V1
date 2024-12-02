import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Patch,
  UploadedFile,
  UseInterceptors,
  Res,
  NotFoundException,
  UseGuards,
  Req,
} from "@nestjs/common";
import { CreateContentDto } from "src/dto/createContent.dto";
import { ContentService } from "./content.service";
import { UpdateContentDto } from "src/dto/updateContent.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { Role, Roles } from "src/Auth/decorators/roles.decorator";
import { authorizationGuard } from "src/Auth/guards/authorization.guard";

@Controller("api/content")
export class ContentController {
  constructor(private readonly contentService: ContentService) {}
  //five endpoints
  //1 getallcontent (admin only)
  //2 getcontentbyid
  //3 get content by courseid
  //4 upload content (post)
  //5 update content (patch)
  //6 delete content (admin only)

  @Roles(Role.Admin)
  @UseGuards(authorizationGuard)
  @Get()
  getAllContent() {
    return this.contentService.getAllContent();
  }

  @Roles(Role.Student, Role.Instructor, Role.Admin)
  @UseGuards(authorizationGuard)
  @Get(":contentId")
  getContentById(@Param("contentId") contentId: string, @Req() req: any) {
    const userRole: Role = req.user.role;
    return this.contentService.getContentById(contentId, userRole);
  }

  @Roles(Role.Student, Role.Instructor, Role.Admin)
  @UseGuards(authorizationGuard)
  @Get("download/:fileVersionId")
  async downloadFile(@Param("fileVersionId") fileVersionId: string, @Res() res: Response) {
    try {
      const filePath = await this.contentService.getFilePath(fileVersionId);

      res.download(filePath, (err) => {
        if (err) {
          throw new NotFoundException(`Failed to download file: ${err.message}`);
        }
      });
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  // CHECK LATER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  //should this stay here or go to the course controller where we
  //shall inject the contentservice there, because the content schema does
  //not store the associated courseid till now...

  //this should also become moduleID not courseID, it is unlikely someone will fetch content based
  //on course and not module
  // @Get("course/:courseId")
  // getContentByCourseId(@Param("courseId") courseId: string) {
  //   return this.contentService.getContentByCourseId(courseId);
  // }

  @Roles(Role.Instructor, Role.Admin)
  @UseGuards(authorizationGuard)
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  uploadContent(@Body() createContentDto: CreateContentDto, @UploadedFile() file: Express.Multer.File) {
    return this.contentService.uploadContent(createContentDto, file);
  }

  @Roles(Role.Instructor, Role.Admin)
  @UseGuards(authorizationGuard)
  @Patch(":id")
  @UseInterceptors(FileInterceptor("file"))
  update(@Param("id") contentId: string, @Body() updateContentDto: UpdateContentDto, @UploadedFile() file: Express.Multer.File) {
    return this.contentService.updateContent(contentId, updateContentDto, file);
  }

  @Roles(Role.Admin)
  @UseGuards(authorizationGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.contentService.deleteContent(id);
  }
}

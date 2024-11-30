import { Controller, Get, Param } from "@nestjs/common";

@Controller("content")
export class ContentController {
  constructor(private readonly contentService: ContentService) {}
  //five endpoints
  //1 getallcontent (admin only)
  //2 getcontentbyid
  //3 get content by courseid
  //4 upload content (post)
  //5 update content (patch)
  //6 delete content (admin only)

  @Get()
  getAllContent() {
    return this.contentService.getAllContent();
  }
  @Get(":contentId")
  getContentById(@Param("contentId") courseId: string) {
    return this.contentService.getContentByCourseId(courseId);
  }
}

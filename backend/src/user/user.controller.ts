import { Controller, Get, Delete, Body, Param, UseGuards, Req, Patch, Res } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { User } from "./model/user.schema";
import { Role, Roles } from "src/Auth/decorators/roles.decorator";
import { authorizationGuard } from "src/Auth/guards/authorization.guard";
import { updateUserDto, UserDto } from "./dtos/user.dto";
import { Request, Response } from "express";
import { AuthGuard } from "src/Auth/guards/authentication.guard";

@UseGuards(AuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @UseGuards(authorizationGuard)
  @Get()
  async findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }
  
  @Get("/me")
  @UseGuards(authorizationGuard)
  async getMyDetails(@Req() request: Request) {
    return await this.userService.getMyDetails(request);
  }

  @Patch(':instructor_id/rate')
  async rateInstructor(@Param('instructor_id') id: string,rating: number): Promise<void> {
    return this.userService.rateInstructor(id,rating);
  }

  @Roles(Role.Instructor,Role.Admin)
  @UseGuards(authorizationGuard)
  @Get("students/course/:courseId")
  async findStudentsByCourse(@Param("courseId") courseId: string): Promise<UserDto[]> {
    return await this.userService.getStudentsInCourse(courseId);
  }

  @Get("instructor/course/:courseId")
  async findInstructorByCourse(@Param("courseId") courseId: string): Promise<UserDto[]> {
    return await this.userService.getInstructorsInCourse(courseId);
  }

  @Roles(Role.Instructor)
  @UseGuards(authorizationGuard)
  @Get("search-student/:name")
  async searchStudentByName(@Param("name") name: string): Promise<UserDto[]> {
    return await this.userService.searchStudentByName(name);
  }

  @Roles(Role.Student)
  @UseGuards(authorizationGuard)
  @Get("search-intructor/:name")
  async searchInstructorByName(@Param("name") name: string): Promise<UserDto[]> {
    return await this.userService.searchInstructorByName(name);
  }

  //get analytic of instructor
  @Roles(Role.Instructor)
  @UseGuards(authorizationGuard)
  @Get("instructor/analytics")
  async getInstructorAnalytics(@Req() req: Request,@Res() res: Response) 
  {
    const csvContent = await this.userService.exportInstructorAnalytics(req);

    // Set the response headers for a downloadable CSV file
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=courses_analytics.csv');

    // Send the CSV content as the response
    res.send(csvContent);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Req() req: Request): Promise<User> {
    return this.userService.findOne(id, req);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: updateUserDto, @Req() req: Request): Promise<User> {
    return this.userService.update(id, updateUserDto, req);
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @Req() req: Request): Promise<void> {
    return this.userService.delete(id, req);
  }
}

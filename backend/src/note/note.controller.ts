import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NoteService } from './note.service';



@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}
//create a new note
  @Post()
  create(@Body() body: any) { 
    return this.noteService.create(body);
  }
//retrieve all notes
  @Get()
  findAll() {
    return this.noteService.findAll();
  }
//get note by id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noteService.findOne(+id);
  }
//get note by course id
@Get('course/:courseId')
findByCourseId(@Param('courseId') courseId: number) {
  return this.noteService.findByCourseId(courseId);
}
//update a note by id 
  @Patch(':id')
  update(@Param('id') id: string, @Body() body:any) {
    return this.noteService.update(+id, body);
  }
//delete a note
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.noteService.remove(+id);
  }
}

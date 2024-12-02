import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NoteService } from './note.service';
import { Note } from 'src/schemas/note.schema';
import { Types } from 'mongoose';
import { NotificationService } from 'src/notifications/notifications.service';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService,private readonly notificationService: NotificationService) {}

  // Create a new note
  @Post()
  async create(@Body() body: Note): Promise<Note> {
    return this.noteService.create(body);
  }

  // Retrieve all notes
  @Get()
  async findAll(): Promise<Note[]> {
    return this.noteService.findAll();
  }

  // Get a note by ID
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Note> {
    return this.noteService.findOne((id));
  }

  // Get notes by course ID
  @Get('course/:courseId')
  async findByCourseId(@Param('courseId') courseId: string): Promise<Note[]> {
    return this.noteService.findByCourseId(Number(courseId));
  }

  // Update a note by ID
  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() body: Partial<Note>
  ): Promise<Note> {
    return this.noteService.update((id), body);
  }

  // Delete a note by ID
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.noteService.delete(id);
  }
  // Share a note 
  @Post('share/:noteId/:userId')
  async share(@Param('noteId') noteId: string,@Param('userId') userId: string):Promise<void>{
    const note = await this.noteService.findOne(noteId);
    await this.notificationService.create({
      user_id:userId,
      message:`Would you like to receive a note from ${userId} ${noteId}`,
      sender_id:note.user_id
     })
  }
}

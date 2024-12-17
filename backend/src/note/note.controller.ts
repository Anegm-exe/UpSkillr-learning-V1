import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { NoteService } from './note.service';
import { Note } from 'src/note/model/note.schema';
import { NotificationService } from 'src/notification/notifications.service';
import { CreateNoteDto, UpdateNoteDto } from './dtos/note.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/Auth/guards/authentication.guard';

@UseGuards(AuthGuard)
@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  // Create a new note
  @Post()
  async create(@Body() body: CreateNoteDto): Promise<Note> {
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
  @Get('user')
  async findByUser(@Req() req: Request): Promise<Note[]> {
    return this.noteService.findByUser(req);
  }

  // Update a note by ID
  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() body: UpdateNoteDto
  ): Promise<Note> {
    return this.noteService.update((id), body);
  }

  // Delete a note by ID
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.noteService.delete(id);
  }
}

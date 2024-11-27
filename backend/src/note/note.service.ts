import { Injectable } from '@nestjs/common';
import { Notes,NotesSchema } from 'src/schemas/notes.schema';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class NoteService {
  // create a note
  async create(noteData: any): Promise<any> { 
    const note = new Notes(noteData); 
    return await note.save(); 
  }

  //retrieve all notes
  async findAll() : Promise<any>{
    const notes = Notes.find();
    return notes ;
  }

  //get note by id
 async findOne(id: number) : Promise<any>  {
    const note = await Notes.findById(id);
    if (!note) {
      throw new NotFoundException(`Note with id #${id} not found`);
    }
    return note;
  }

  //get note by course id
  async findByCourseId(courseId: number): Promise<any[]> {
    const notes = await Notes.find({ courseId }); // Query notes with the given courseId
    if (!notes || notes.length === 0) {
      throw new NotFoundException(`No notes found for course id #${courseId}`);
    }
    return notes;
  }

  //update note
  async update(id: number, updateData: any): Promise<any> {
    const note = await Notes.findById(id);
    if (!note) {
      throw new NotFoundException(`Note with id #${id} not found`);
    }
    Object.assign(note, updateData); // Merge the update data into the note
    return await note.save(); 
  }

  //delete a note
  async remove(id: number): Promise<{ message: string }> {
    const note = await Notes.findById(id);
    if (!note) {
      throw new NotFoundException(`Note with id #${id} not found`);
    }
    await note.deleteOne(); 
    return { message: `Note with id #${id} has been removed` };
  }
}

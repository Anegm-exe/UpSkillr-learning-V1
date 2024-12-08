import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { Note,NoteDocument} from 'src/note/model/note.schema';
import { CreateNoteDto, UpdateNoteDto } from './dtos/note.dto';
import { Request } from 'express';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>,) { }
  // create a note
  async create(noteData: CreateNoteDto): Promise<Note> { 
    const note = new this.noteModel(noteData); 
    return await note.save(); 
  }

  //retrieve all notes
  async findAll(): Promise<Note[]> {
    return this.noteModel.find().exec();
}
  //get note by id
 async findOne(id: string): Promise<Note> {
    const note = await this.noteModel.findOne({_id:id}).exec();
    if (!note) {
      throw new NotFoundException(`Note with id #${id} not found`);
    }
    return note;
  }

  //get note by course id
  async findByUser(req: Request): Promise<Note[]> {
    const notes = await this.noteModel.find({ user_id:req['user'].userid }).exec(); // Query notes with the given courseId
    if (!notes || notes.length === 0) {
      throw new NotFoundException(`No notes found for course id #${req['user'].userid}`);
    }
    return notes;
  }

  //update note
  async update(id: string, updateData: UpdateNoteDto): Promise<Note> {
    const updatedNote = await this.noteModel
        .findOneAndUpdate({ _id: id }, updateData, { new: true })
        .exec();
    if (!updatedNote) {
        throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return updatedNote;
}
  //delete a note
  async delete(id: string): Promise<void> {
    const result = await this.noteModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
        throw new NotFoundException(`Note with ID ${id} not found`);
    }
}
}


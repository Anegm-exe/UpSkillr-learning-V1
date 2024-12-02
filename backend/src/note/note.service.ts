import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { Note,NoteDocument} from 'src/schemas/note.schema';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>,) { }
  // create a note
  async create(noteData: Partial<Note>): Promise<Note> { 
    const note = new this.noteModel(noteData); 
    return await note.save(); 
  }

  //retrieve all notes
  async findAll(): Promise<Note[]> {
    return this.noteModel.find().exec();
}
  //get note by id
 async findOne(id: String): Promise<Note> {
    const note = await this.noteModel.findOne(id).exec();
    if (!note) {
      throw new NotFoundException(`Note with id #${id} not found`);
    }
    return note;
  }

  //get note by course id
  async findByCourseId(courseId: number): Promise<Note[]> {
    const notes = await this.noteModel.find({ courseId }).exec(); // Query notes with the given courseId
    if (!notes || notes.length === 0) {
      throw new NotFoundException(`No notes found for course id #${courseId}`);
    }
    return notes;
  }

  //update note
  async update(id: String, updateData: Partial<Note>): Promise<Note> {
    const updatedNote = await this.noteModel
        .findOneAndUpdate({ _id: id }, updateData, { new: true })
        .exec();
    if (!updatedNote) {
        throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return updatedNote;
}
  //delete a note
  async delete(id: String): Promise<void> {
    const result = await this.noteModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
        throw new NotFoundException(`Note with ID ${id} not found`);
    }
}
//share a note

}

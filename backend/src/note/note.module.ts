import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Note, NoteSchema } from 'src/schemas/note.schema'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Note.name,
            schema: NoteSchema
        }])
    ],
    controllers:[],
    providers:[]
})


export class NoteModule {}
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { module, ModuleSchema } from 'src/schemas/module.schema'
import { ModuleController } from './module.controller'
import { ModuleService } from './module.service'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: module.name,
            schema: ModuleSchema
        }])
    ],
    controllers:[ModuleController],
    providers:[ModuleService]
})


export class ModuleModule {}
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Modules, ModuleSchema } from 'src/schemas/module.schema'
import { ModuleController } from './module.controller'
import { ModuleService } from './module.service'

@Module({
    imports:[
        MongooseModule.forFeature([{
            name: Modules.name,
            schema: ModuleSchema
        }])
    ],
    controllers:[ModuleController],
    providers:[ModuleService]
})


export class ModuleModule {}
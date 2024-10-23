import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { CommandsModule } from 'src/commands/commands.module';

@Module({
  imports: [CommandsModule],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}

import { Recipe } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CommandEntity } from 'src/commands/entities/command.entity';

export class RecipeEntity implements Recipe {
  constructor({ commands, ...partial }: Partial<RecipeEntity>) {
    Object.assign(this, partial);

    if (commands) {
      this.commands = commands.map((command) => new CommandEntity(command));
    }
  }

  @ApiProperty({ type: String, required: true })
  @Expose()
  id: string;

  @ApiProperty({ type: String, required: true })
  @Expose()
  name: string;

  @ApiProperty({
    type: CommandEntity,
    isArray: true,
    required: false,
  })
  @Expose()
  @Transform(({ value }) => (value.length === 0 ? undefined : value))
  commands?: CommandEntity[];
}

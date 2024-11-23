import { Prisma, Recipe } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CommandEntity } from 'src/commands/entities/command.entity';

type CommandsInRecipeWithCommand = Prisma.CommandsInRecipeGetPayload<{
  include: { command: true };
}>;

export class RecipeEntity implements Recipe {
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
  @Transform(({ value }) =>
    Array.isArray(value) && value.length === 0
      ? undefined
      : value.map(
          (commandRaw: CommandsInRecipeWithCommand) =>
            new CommandEntity(commandRaw.command),
        ),
  )
  commands?: CommandEntity[];

  @ApiProperty({
    type: Date,
    required: true,
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    required: true,
  })
  @Expose()
  updatedAt: Date;

  constructor({ commands, ...partial }: Partial<RecipeEntity>) {
    Object.assign(this, partial);

    if (commands) {
      this.commands = commands.map((command) => new CommandEntity(command));
    }
  }
}

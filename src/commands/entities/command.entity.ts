import { Command, CommandType } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CommandOptionEntity } from './command-option.entity';
import { CommandParameterEntity } from './command-parameter.entity';

export class CommandEntity implements Command {
  @ApiProperty({ type: String, required: true })
  @Expose()
  id: string;

  @ApiProperty({ type: String, required: true })
  @Expose()
  originalId: string;

  @ApiProperty({ type: String, required: true })
  @Expose()
  name: string;

  @ApiProperty({
    enum: CommandType,
    required: true,
  })
  @Expose()
  type: CommandType;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Expose()
  description: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Expose()
  payload: string;

  @ApiProperty({
    type: CommandOptionEntity,
    isArray: true,
    required: false,
  })
  @Expose()
  @Transform(({ value }) => (value && value.length === 0 ? undefined : value))
  options?: CommandOptionEntity[];

  @ApiProperty({
    type: CommandParameterEntity,
    isArray: true,
    required: false,
  })
  @Expose()
  @Transform(({ value }) => (value && value.length === 0 ? undefined : value))
  parameters?: CommandParameterEntity[];

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

  @Exclude()
  recipeId: string | null;

  constructor({ options, parameters, ...partial }: Partial<CommandEntity>) {
    Object.assign(this, partial);

    if (options) {
      this.options = options.map((option) => new CommandOptionEntity(option));
    }

    if (parameters) {
      this.parameters = parameters.map(
        (parameter) => new CommandParameterEntity(parameter),
      );
    }
  }
}

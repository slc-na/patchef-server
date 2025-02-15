import { CommandOption } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CommandParameterEntity } from './command-parameter.entity';

export class CommandOptionEntity implements CommandOption {
  @ApiProperty({
    type: String,
    required: true,
  })
  @Expose()
  id: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @Expose()
  name: string;

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
    type: String,
    required: false,
  })
  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  delimiter: string | null;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @Expose()
  enabled: boolean;

  @ApiProperty({
    type: Boolean,
    required: true,
  })
  @Expose()
  parameterRequired: boolean;

  @ApiProperty({
    type: CommandParameterEntity,
    isArray: true,
    required: false,
  })
  @Expose()
  @Transform(({ value }) =>
    Array.isArray(value) && value.length === 0 ? undefined : value,
  )
  parameters?: CommandParameterEntity[];

  @Exclude()
  commandId: string | null;

  constructor({ parameters, ...partial }: Partial<CommandOptionEntity>) {
    Object.assign(this, partial);

    if (parameters) {
      this.parameters = parameters.map(
        (parameter) => new CommandParameterEntity(parameter),
      );
    }
  }
}

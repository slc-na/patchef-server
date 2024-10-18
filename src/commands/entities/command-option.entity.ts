import { CommandOption } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CommandParameterEntity } from './command-parameter.entity';

export class CommandOptionEntity implements CommandOption {
  constructor({ parameters, ...partial }: Partial<CommandOptionEntity>) {
    Object.assign(this, partial);

    if (parameters) {
      this.parameters = parameters.map(
        (parameter) => new CommandParameterEntity(parameter),
      );
    }
  }

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

  @Exclude()
  commandId: string | null;

  @Expose()
  parameters?: CommandParameterEntity[];
}

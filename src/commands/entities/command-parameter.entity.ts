import { CommandParameter } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CommandParameterEntity implements CommandParameter {
  constructor(partial: Partial<CommandParameterEntity>) {
    Object.assign(this, partial);
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
    required: false,
  })
  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  payload: string | null;

  @Exclude()
  commandOptionId: string | null;

  @Exclude()
  commandId: string | null;
}

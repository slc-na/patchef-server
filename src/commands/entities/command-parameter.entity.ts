import { CommandParameter } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';

export class CommandParameterEntity implements CommandParameter {
  constructor(partial: Partial<CommandParameterEntity>) {
    Object.assign(this, partial);
  }

  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  payload: string | null;

  @Exclude()
  commandOptionId: string | null;

  @Exclude()
  commandId: string | null;
}

import { CommandOption } from '@prisma/client';
import { Exclude, Expose, Transform } from 'class-transformer';
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

  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  payload: string;

  @Expose()
  @Transform(({ value }) => (value === null ? undefined : value))
  delimiter: string | null;

  @Expose()
  enabled: boolean;

  @Expose()
  parameterRequired: boolean;

  @Exclude()
  commandId: string | null;

  @Expose()
  parameters?: CommandParameterEntity[];
}

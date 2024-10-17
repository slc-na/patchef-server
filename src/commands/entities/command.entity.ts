import { Command, CommandType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { CommandOptionEntity } from './command-option.entity';
import { CommandParameterEntity } from './command-parameter.entity';

export class CommandEntity implements Command {
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

  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  type: CommandType;

  @Expose()
  description: string;

  @Expose()
  payload: string;

  @Expose()
  options?: CommandOptionEntity[];

  @Expose()
  parameters?: CommandParameterEntity[];
}

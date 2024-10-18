import { Injectable } from '@nestjs/common';
import { CreateCommandDto } from './dto/create-command/create-command.dto';
import { UpdateCommandDto } from './dto/update-command/update-command.dto';
import { PrismaService } from 'nestjs-prisma';
import { Command } from '@prisma/client';

@Injectable()
export class CommandsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCommandDto: CreateCommandDto): Promise<Command> {
    const { options, parameters, ...command } = createCommandDto;

    const newCommand = await this.prismaService.command.create({
      data: {
        ...command,
        options: {
          createMany: {
            data: options,
          },
        },
        parameters: {
          createMany: {
            data: parameters,
          },
        },
      },
      include: {
        options: true,
        parameters: true,
      },
    });

    return newCommand;
  }

  async findAll(): Promise<Command[]> {
    return await this.prismaService.command.findMany({
      include: {
        options: true,
        parameters: true,
      },
    });
  }

  async findOne(id: string): Promise<Command> {
    return await this.prismaService.command.findUnique({
      where: {
        id,
      },
      include: {
        options: true,
        parameters: true,
      },
    });
  }

  async update(
    id: string,
    updateCommandDto: UpdateCommandDto,
  ): Promise<Command> {
    /*
     * The following code is used to update a command in the database.
     * It retrieves the options and parameters from the updateCommandDto and updates the command with the new values.
     * The updated command is then returned.
     */
    const { options, parameters, ...command } = updateCommandDto;

    /*
     * The updated options and parameters are created by iterating over the existing options and parameters and updating
     * the values with the new ones. The commandId is set to undefined to prevent it from being included in the update.
     * Note: The Update DTOs for options and parameters MUST HAVE an id field to identify the option or parameter to update.
     */
    const commandOptions = await this.prismaService.commandOption.findMany({
      where: {
        commandId: id,
      },
    });

    const updatedCommandOptions = commandOptions.map((option) => {
      for (const updateOption of options) {
        if (option.id === updateOption.id) {
          return { ...option, ...updateOption, commandId: undefined };
        }
      }
    });

    const commandParameters =
      await this.prismaService.commandParameter.findMany({
        where: {
          commandId: id,
        },
      });

    const updatedCommandParameters = commandParameters.map((parameter) => {
      for (const updateParameter of parameters) {
        if (parameter.id === updateParameter.id) {
          return { ...parameter, ...updateParameter, commandId: undefined };
        }
      }
    });

    /*
     * Updating the command involves deleting the existing options and parameters and creating new ones.
     * The new ones are actually just the old ones with the updated values.
     */
    const updatedCommand = await this.prismaService.command.update({
      where: { id },
      data: {
        ...command,
        options: {
          deleteMany: {},
          createMany: {
            data: updatedCommandOptions,
          },
        },
        parameters: {
          deleteMany: {},
          createMany: {
            data: updatedCommandParameters,
          },
        },
      },
      include: {
        options: true,
        parameters: true,
      },
    });

    return updatedCommand;
  }

  async remove(id: string): Promise<Command> {
    return await this.prismaService.command.delete({
      where: { id },
      include: { options: true, parameters: true },
    });
  }
}

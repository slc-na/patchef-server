import { Injectable } from '@nestjs/common';
import { CreateCommandDto } from './dto/create-command/create-command.dto';
import { UpdateCommandDto } from './dto/update-command/update-command.dto';
import { PrismaService } from 'nestjs-prisma';
import { Command } from '@prisma/client';
import { CommandEntity } from './entities/command.entity';

@Injectable()
export class CommandsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCommandDto: CreateCommandDto): Promise<Command> {
    const {
      options: commandOptions,
      parameters: commandParameters,
      ...commandData
    } = createCommandDto;

    const createdCommand = await this.prismaService.$transaction(
      async (prisma) => {
        const createdCommand = await prisma.command.create({
          data: {
            ...commandData,
            id: commandData.id,
            originalId: commandData.id,
            parameters: {
              createMany: {
                data: commandParameters ?? [],
              },
            },
          },
        });

        if (commandOptions) {
          for (const commandOption of commandOptions) {
            const {
              parameters: commandOptionParameters,
              ...commandOptionData
            } = commandOption;

            await prisma.commandOption.create({
              data: {
                ...commandOptionData,
                commandId: createdCommand.id,
                parameters: {
                  createMany: {
                    data: commandOptionParameters,
                  },
                },
              },
            });
          }
        }

        return await prisma.command.findUnique({
          where: {
            originalId: createdCommand.originalId,
          },
          include: {
            options: {
              include: {
                parameters: true,
              },
            },
            parameters: true,
          },
        });
      },
    );

    return createdCommand;
  }

  async createBulk(commandEntities: CommandEntity[]) {
    const commands = await this.prismaService.$transaction(async (prisma) => {
      const commands = [];

      for (const commandEntity of commandEntities) {
        const {
          options: commandOptions,
          parameters: commandParameters,
          ...commandData
        } = commandEntity;

        const createdCommand = await prisma.command.create({
          data: {
            ...commandData,
            originalId: commandData.id,
            parameters: {
              createMany: {
                data: commandParameters ?? [],
              },
            },
          },
        });

        if (commandOptions) {
          for (const commandOption of commandOptions) {
            const {
              parameters: commandOptionParameters,
              ...commandOptionData
            } = commandOption;

            await prisma.commandOption.create({
              data: {
                ...commandOptionData,
                commandId: createdCommand.id,
                parameters: {
                  createMany: {
                    data: commandOptionParameters ?? [],
                  },
                },
              },
            });
          }
        }

        const finalCreatedCommand = await prisma.command.findUnique({
          where: {
            originalId: createdCommand.originalId,
          },
          include: {
            options: {
              include: {
                parameters: true,
              },
            },
            parameters: true,
          },
        });

        commands.push(finalCreatedCommand);
      }

      return commands;
    });

    return commands;
  }

  async findAll(): Promise<Command[]> {
    return await this.prismaService.command.findMany({
      include: {
        options: {
          include: {
            parameters: true,
          },
        },
        parameters: true,
      },
    });
  }

  async findOne(id: string): Promise<Command> {
    return await this.prismaService.command.findUnique({
      where: {
        originalId: id,
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
    const {
      options: commandOptions,
      parameters: commandParameters,
      ...commandData
    } = updateCommandDto;

    const updatedCommand = await this.prismaService.$transaction(
      async (prisma) => {
        const updatedCommand = await prisma.command.update({
          where: { originalId: id },
          data: {
            ...commandData,
            parameters: {
              deleteMany: {},
              createMany: {
                data: commandParameters
                  ? commandParameters.map((parameter) => ({
                      id: parameter.id,
                      name: parameter.name,
                      description: parameter.description,
                      payload: parameter.payload,
                    }))
                  : [],
              },
            },
            options: {
              deleteMany: {},
            },
          },
        });

        if (commandOptions) {
          for (const commandOption of commandOptions) {
            const {
              parameters: commandOptionParameters,
              ...commandOptionData
            } = commandOption;

            await prisma.commandOption.create({
              data: {
                ...commandOptionData,
                commandId: updatedCommand.id,
                parameters: {
                  createMany: {
                    data: commandOptionParameters,
                  },
                },
              },
            });
          }
        }

        return await prisma.command.findUnique({
          where: {
            originalId: updatedCommand.originalId,
          },
          include: {
            options: {
              include: {
                parameters: true,
              },
            },
            parameters: true,
          },
        });
      },
    );

    return updatedCommand;
  }

  async remove(id: string): Promise<Command> {
    return await this.prismaService.command.delete({
      where: { originalId: id },
      include: {
        options: {
          include: {
            parameters: true,
          },
        },
        parameters: true,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { CreateCommandDto } from './dto/create-command/create-command.dto';
import { UpdateCommandDto } from './dto/update-command/update-command.dto';
import { PrismaService } from 'nestjs-prisma';
import { Command } from '@prisma/client';

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
            parameters: {
              createMany: {
                data: commandParameters,
              },
            },
          },
        });

        for (const commandOption of commandOptions) {
          const { parameters: commandOptionParameters, ...commandOptionData } =
            commandOption;

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

        return prisma.command.findUnique({
          where: {
            id: createdCommand.id,
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
    const {
      options: commandOptions,
      parameters: commandParameters,
      ...commandData
    } = updateCommandDto;

    const updatedCommand = await this.prismaService.$transaction(
      async (prisma) => {
        const updatedCommand = await prisma.command.update({
          where: { id },
          data: {
            ...commandData,
            parameters: {
              deleteMany: {},
              createMany: {
                data: commandParameters.map((parameter) => ({
                  id: parameter.id,
                  name: parameter.name,
                  description: parameter.description,
                  payload: parameter.payload,
                })),
              },
            },
            options: {
              deleteMany: {},
            },
          },
        });

        for (const commandOption of commandOptions) {
          const { parameters: commandOptionParameters, ...commandOptionData } =
            commandOption;

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

        return prisma.command.findUnique({
          where: {
            id: updatedCommand.id,
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
    return await this.prismaService.$transaction(async (prisma) => {
      return await prisma.command.delete({
        where: { id },
        include: {
          options: {
            include: {
              parameters: true,
            },
          },
          parameters: true,
        },
      });
    });
  }
}

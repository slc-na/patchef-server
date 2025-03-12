import { Injectable } from '@nestjs/common';
import { CreateCommandDto } from './dto/create-command/create-command.dto';
import { UpdateCommandDto } from './dto/update-command/update-command.dto';
import { PrismaService } from 'nestjs-prisma';
import { Command } from '@prisma/client';
import { CommandEntity } from './entities/command.entity';
import { UploadCommandDTO } from './dto/create-command/upload-command.dto';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
@Injectable()
export class CommandsService {
  private readonly remoteServer = `${process.env.ZOU_URL}\Public`;
  private readonly localTempPath = path.join(__dirname, '..', 'temp'); // Local temp storage before SCP
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

  async uploadCommand(
    uploadCommandDTO: UploadCommandDTO,
  ): Promise<{ message: string; filePath: string }> {
    try {
      const { folderName, commands } = uploadCommandDTO;

      if (!fs.existsSync(this.localTempPath)) {
        fs.mkdirSync(this.localTempPath, { recursive: true });
      }

      const batchFileName = 'main.bat';
      const localFilePath = path.join(this.localTempPath, batchFileName);
      const batchContent = commands.join('\r\n');
      const academicYear = this.getAcademicYear();
      fs.writeFileSync(localFilePath, batchContent);
      console.log(`Batch file created at: ${localFilePath}`);

      const networkPath = `\\\\10.22.64.20\\Public\\${academicYear}\\${folderName}\\`;

      const mkdirCommand = `mkdir "${networkPath.substring(0, networkPath.lastIndexOf('\\'))}"`;

      return new Promise((resolve, reject) => {
        exec(mkdirCommand, (mkdirError) => {
          if (mkdirError) {
            console.error('Failed to create directory:', mkdirError.message);
            reject({
              error: 'Failed to create target directory',
              details: mkdirError.message,
            });
            return;
          }
          const copyCommand = `xcopy /Y "${localFilePath}" "${networkPath}"`;

          exec(copyCommand, (copyError, stdout, stderr) => {
            if (copyError) {
              console.error('Copy Transfer Failed:', copyError.message);
              reject({
                error: 'Failed to transfer batch file',
                details: copyError.message,
              });
            } else {
              console.log('Copy Transfer Output:', stdout);
              console.error('Copy Transfer Errors:', stderr);
              resolve({
                message: 'Batch file uploaded and transferred successfully',
                filePath: networkPath,
              });
            }
          });
        });
      });
    } catch (error) {
      console.error('Error in uploadCommand:', error);
      throw new Error('Failed to process batch file');
    }
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
  getAcademicYear(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Months are 0-based in JavaScript

    // If it's August (8) or later, the academic year starts this year
    const startYear = month >= 8 ? year : year - 1;
    const endYear = startYear + 1;

    return `${startYear.toString().slice(-2)}${endYear.toString().slice(-2)}`;
  }
}

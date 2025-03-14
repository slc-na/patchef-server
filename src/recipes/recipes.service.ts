import { Injectable, Logger } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PublishRecipeDto } from './dto/publish-recipe.dto';
import { Recipe } from '@prisma/client';
import { RecipeCommandEntity } from './entities/recipe-command.entity';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';
import path from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { exec } from 'child_process';

@Injectable()
export class RecipesService {
  private readonly logger = new Logger(RecipesService.name);

  private readonly recipeRepositoryDirectory = `${this.configService.get<string>('RECIPE_REPOSITORY_SERVER_URL')}`;
  private readonly localTempPath = path.join(__dirname, '..', 'temp');

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const createdRecipe = await this.prismaService.$transaction(
      async (prisma) => {
        const { commands: recipeCommands, ...recipeData } = createRecipeDto;

        const createdRecipe = await prisma.recipe.create({
          data: {
            ...recipeData,
          },
        });

        for (let i = 0; i < recipeCommands.length; i++) {
          const recipeCommand = recipeCommands[i];

          await prisma.commandsInRecipe.create({
            data: {
              commandId: recipeCommand.originalId,
              recipeId: createdRecipe.id,
              order: i,
            },
          });

          if (recipeCommand.parameters) {
            for (const recipeCommandParameter of recipeCommand.parameters) {
              await prisma.commandParameterPayloadsInRecipe.create({
                data: {
                  payload: recipeCommandParameter.payload,
                  commandParameterId: recipeCommandParameter.id,
                  commandsInRecipeOrder: i,
                  commandsInRecipeCommandId: recipeCommand.originalId,
                  commandsInRecipeRecipeId: createdRecipe.id,
                },
              });
            }
          }

          if (recipeCommand.options) {
            for (const recipeCommandOption of recipeCommand.options) {
              for (const recipeCommandOptionParameter of recipeCommandOption.parameters) {
                await prisma.commandOptionParameterPayloadsInRecipe.create({
                  data: {
                    payload: recipeCommandOptionParameter.payload,
                    commandParameterId: recipeCommandOptionParameter.id,
                    commandOptionId: recipeCommandOption.id,
                    commandsInRecipeOrder: i,
                    commandsInRecipeCommandId: recipeCommand.originalId,
                    commandsInRecipeRecipeId: createdRecipe.id,
                  },
                });
              }
            }
          }
        }

        return await prisma.recipe.findUnique({
          where: {
            id: createdRecipe.id,
          },
          include: {
            commands: {
              orderBy: {
                order: 'asc',
              },
              include: {
                command: {
                  include: {
                    options: {
                      include: {
                        parameters: true,
                      },
                    },
                    parameters: true,
                  },
                },
              },
            },
          },
        });
      },
    );

    return createdRecipe;
  }

  async findAll(): Promise<Recipe[]> {
    const recipes = this.prismaService.$transaction(async (prisma) => {
      const recipes = await prisma.recipe.findMany({
        include: {
          commands: {
            orderBy: {
              order: 'asc',
            },
            include: {
              command: {
                include: {
                  options: {
                    include: {
                      parameters: true,
                    },
                  },
                  parameters: true,
                },
              },
            },
          },
        },
      });

      const recipeCommandParameterPayloads =
        await prisma.commandParameterPayloadsInRecipe.findMany();

      const recipeCommandOptionPayloads =
        await prisma.commandOptionParameterPayloadsInRecipe.findMany();

      const recipesWithPayloads = recipes.map((recipe) => {
        const commands = recipe.commands.map((command, index) => {
          const commandParameterPayloads =
            recipeCommandParameterPayloads.filter((commandParameterPayload) => {
              return (
                commandParameterPayload.commandsInRecipeCommandId ===
                  command.commandId &&
                commandParameterPayload.commandsInRecipeRecipeId ===
                  recipe.id &&
                commandParameterPayload.commandsInRecipeOrder === index
              );
            });

          const commandOptionPayloads = recipeCommandOptionPayloads.filter(
            (commandOptionPayload) => {
              return (
                commandOptionPayload.commandsInRecipeCommandId ===
                  command.commandId &&
                commandOptionPayload.commandsInRecipeRecipeId === recipe.id &&
                commandOptionPayload.commandsInRecipeOrder === index
              );
            },
          );

          if (
            commandParameterPayloads.length === 0 &&
            commandOptionPayloads.length === 0
          ) {
            return command;
          }

          return {
            ...command,
            command: new RecipeCommandEntity(
              command.command,
              commandParameterPayloads,
              commandOptionPayloads,
            ),
          };
        });

        return {
          ...recipe,
          commands,
        };
      });

      return recipesWithPayloads;
    });

    return recipes;
  }

  async findOne(id: string): Promise<Recipe> {
    const recipe = await this.prismaService.$transaction(async (prisma) => {
      const recipe = await prisma.recipe.findUnique({
        where: {
          id,
        },
        include: {
          commands: {
            orderBy: {
              order: 'asc',
            },
            include: {
              command: {
                include: {
                  options: {
                    include: {
                      parameters: true,
                    },
                  },
                  parameters: true,
                },
              },
            },
          },
        },
      });

      const recipeCommandParameterPayloads =
        await prisma.commandParameterPayloadsInRecipe.findMany({
          where: {
            commandsInRecipeRecipeId: id,
          },
        });

      const recipeCommandOptionPayloads =
        await prisma.commandOptionParameterPayloadsInRecipe.findMany({
          where: {
            commandsInRecipeRecipeId: id,
          },
        });

      const commands = recipe.commands.map((command, index) => {
        const commandParameterPayloads = recipeCommandParameterPayloads.filter(
          (commandPayload) => {
            return (
              commandPayload.commandsInRecipeCommandId === command.commandId &&
              commandPayload.commandsInRecipeRecipeId === recipe.id &&
              commandPayload.commandsInRecipeOrder === index
            );
          },
        );

        const commandOptionPayloads = recipeCommandOptionPayloads.filter(
          (commandOptionPayload) => {
            return (
              commandOptionPayload.commandsInRecipeCommandId ===
                command.commandId &&
              commandOptionPayload.commandsInRecipeRecipeId === recipe.id &&
              commandOptionPayload.commandsInRecipeOrder === index
            );
          },
        );

        return {
          ...command,
          command: new RecipeCommandEntity(
            command.command,
            commandParameterPayloads,
            commandOptionPayloads,
          ),
        };
      });

      return {
        ...recipe,
        commands,
      };
    });

    return recipe;
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    return await this.prismaService.recipe.update({
      where: {
        id: id,
      },
      data: {
        ...updateRecipeDto,
      },
      include: {
        commands: {
          orderBy: {
            order: 'asc',
          },
          include: {
            command: {
              include: {
                options: {
                  include: {
                    parameters: true,
                  },
                },
                parameters: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string): Promise<Recipe> {
    const removedRecipe = await this.prismaService.$transaction(
      async (prisma) => {
        const removedRecipe = await prisma.recipe.findUnique({
          where: {
            id,
          },
          include: {
            commands: {
              orderBy: {
                order: 'asc',
              },
              include: {
                command: {
                  include: {
                    options: {
                      include: {
                        parameters: true,
                      },
                    },
                    parameters: true,
                  },
                },
              },
            },
          },
        });

        await prisma.commandsInRecipe.deleteMany({
          where: {
            recipeId: id,
          },
        });

        await prisma.recipe.delete({
          where: { id },
          include: {
            commands: {
              orderBy: {
                order: 'asc',
              },
              include: {
                command: {
                  include: {
                    options: {
                      include: {
                        parameters: true,
                      },
                    },
                    parameters: true,
                  },
                },
              },
            },
          },
        });

        return removedRecipe;
      },
    );

    return removedRecipe;
  }

  getAcademicYear(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const startYear = month >= 8 ? year : year - 1;
    const endYear = startYear + 1;

    return `${startYear.toString().slice(-2)}${endYear.toString().slice(-2)}`;
  }

  async publishRecipe(
    publishRecipeDto: PublishRecipeDto,
  ): Promise<{ message: string; filePath: string }> {
    try {
      const { directoryName, fileName, commands } = publishRecipeDto;

      if (!existsSync(this.localTempPath)) {
        mkdirSync(this.localTempPath, { recursive: true });
      }

      const localFilePath = path.join(this.localTempPath, fileName);
      const batchContent = commands.join('\r\n');
      const academicYear = this.getAcademicYear();
      writeFileSync(localFilePath, batchContent);
      this.logger.log(`Batch file created at: ${localFilePath}`);

      const networkPath = `${this.recipeRepositoryDirectory}\\${academicYear}\\${directoryName}`;
      const mkdirCommand = `mkdir "${networkPath.substring(0, networkPath.lastIndexOf('\\'))}"`;

      return new Promise((resolve, reject) => {
        exec(mkdirCommand, (mkdirError) => {
          if (mkdirError) {
            this.logger.error(
              'Failed to create directory:',
              mkdirError.message,
            );
            reject({
              error: 'Failed to create target directory',
              details: mkdirError.message,
            });
            return;
          }

          const copyCommand = `xcopy /Y "${localFilePath}" "${networkPath}"`;

          exec(copyCommand, (copyError, stdout, stderr) => {
            if (copyError) {
              this.logger.error('Copy Transfer Failed:', copyError.message);
              reject({
                error: 'Failed to transfer batch file',
                details: copyError.message,
              });
            } else {
              this.logger.log('Copy Transfer Output:', stdout);
              this.logger.error('Copy Transfer Errors:', stderr);
              resolve({
                message: 'Batch script file published successfully',
                filePath: networkPath,
              });
            }
          });
        });
      });
    } catch (error) {
      this.logger.error('Error in publishRecipe:', error);
      throw new Error('Something went wrong while publishing the recipe');
    }
  }
}

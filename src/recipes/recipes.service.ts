import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PrismaService } from 'nestjs-prisma';
import { Recipe } from '@prisma/client';
import { RecipeCommandEntity } from './entities/recipe-command.entity';

@Injectable()
export class RecipesService {
  constructor(private readonly prismaService: PrismaService) {}

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
}

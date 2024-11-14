import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PrismaService } from 'nestjs-prisma';
import { Recipe } from '@prisma/client';

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
          await prisma.commandsInRecipe.create({
            data: {
              commandId: recipeCommands[i].originalId,
              recipeId: createdRecipe.id,
              order: i,
            },
          });
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
    return await this.prismaService.recipe.findMany({
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

  async findOne(id: string): Promise<Recipe> {
    return await this.prismaService.recipe.findUnique({
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

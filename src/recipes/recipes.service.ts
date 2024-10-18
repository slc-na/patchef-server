import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PrismaService } from 'nestjs-prisma';
import { Recipe } from '@prisma/client';

@Injectable()
export class RecipesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const { commands, ...recipe } = createRecipeDto;

    const newRecipe = await this.prismaService.recipe.create({
      data: {
        ...recipe,
        commands: {
          createMany: {
            data: commands,
          },
        },
      },
      include: {
        commands: true,
      },
    });

    return newRecipe;
  }

  async findAll(): Promise<Recipe[]> {
    return await this.prismaService.recipe.findMany({
      include: {
        commands: true,
      },
    });
  }

  async findOne(id: string): Promise<Recipe> {
    return await this.prismaService.recipe.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto): Promise<Recipe> {
    /*
     * The following code is used to update a recipe in the database.
     * It retrieves the commands from the updateRecipeDto and updates the recipe with the new values.
     * The updated recipe is then returned.
     */
    const { commands, ...recipe } = updateRecipeDto;

    /*
     * The updated commands are created by iterating over the existing commands and updating
     * the values with the new ones. The recipeId is set to undefined to prevent it from being included in the update.
     * Note: The Update DTOs for commands MUST HAVE an id field to identify the command to update.
     */
    const recipeCommands = await this.prismaService.command.findMany({
      where: {
        recipeId: id,
      },
    });

    const updatedRecipeCommands = recipeCommands.map((command) => {
      for (const updateCommand of commands) {
        if (command.id === updateCommand.id) {
          return { ...command, ...updateCommand, recipeId: undefined };
        }
      }
    });

    /*
     * Updating the command involves deleting the existing options and parameters and creating new ones.
     * The new ones are actually just the old ones with the updated values.
     */
    const updatedRecipe = await this.prismaService.recipe.update({
      where: { id },
      data: {
        ...recipe,
        commands: {
          deleteMany: {},
          createMany: {
            data: updatedRecipeCommands,
          },
        },
      },
      include: {
        commands: true,
      },
    });

    return updatedRecipe;
  }

  async remove(id: string): Promise<Recipe> {
    return await this.prismaService.recipe.delete({
      where: { id },
      include: { commands: true },
    });
  }
}

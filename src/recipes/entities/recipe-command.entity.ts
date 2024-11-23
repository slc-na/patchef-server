import { CommandParameterPayloadsInRecipe } from '@prisma/client';
import { CommandEntity } from 'src/commands/entities/command.entity';

export class RecipeCommandEntity extends CommandEntity {
  constructor(
    commandEntity: Partial<CommandEntity>,
    recipeCommandPayloads: CommandParameterPayloadsInRecipe[],
  ) {
    super(commandEntity);

    this.parameters = this.parameters.map((parameter) => {
      const parameterPayload = recipeCommandPayloads.find(
        (payload) => payload.commandParameterId === parameter.id,
      );

      return {
        ...parameter,
        payload: parameterPayload.payload,
      };
    });
  }
}

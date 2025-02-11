import {
  CommandOptionParameterPayloadsInRecipe,
  CommandParameterPayloadsInRecipe,
} from '@prisma/client';
import { CommandEntity } from 'src/commands/entities/command.entity';

export class RecipeCommandEntity extends CommandEntity {
  constructor(
    commandEntity: Partial<CommandEntity>,
    recipeCommandParameterPayloads: CommandParameterPayloadsInRecipe[],
    recipeCommandOptionPayloads: CommandOptionParameterPayloadsInRecipe[],
  ) {
    super(commandEntity);

    this.parameters = this.parameters.map((parameter) => {
      const parameterPayload = recipeCommandParameterPayloads.find(
        (payload) => payload.commandParameterId === parameter.id,
      );

      return {
        ...parameter,
        payload: parameterPayload.payload,
      };
    });

    this.options = this.options.map((option) => {
      const optionParameters = option.parameters.map((parameter) => {
        const parameterPayload = recipeCommandOptionPayloads.find(
          (payload) => payload.commandParameterId === parameter.id,
        );

        return {
          ...parameter,
          payload: parameterPayload.payload,
        };
      });

      return {
        ...option,
        parameters: optionParameters,
        enabled: true,
      };
    });
  }
}

-- CreateTable
CREATE TABLE "CommandOptionParameterPayloadsInRecipe" (
    "payload" TEXT NOT NULL,
    "commandParameterId" TEXT NOT NULL,
    "commandOptionId" TEXT NOT NULL,
    "commandsInRecipeCommandId" TEXT NOT NULL,
    "commandsInRecipeRecipeId" TEXT NOT NULL,
    "commandsInRecipeOrder" INTEGER NOT NULL,

    CONSTRAINT "CommandOptionParameterPayloadsInRecipe_pkey" PRIMARY KEY ("commandOptionId","commandParameterId","commandsInRecipeCommandId","commandsInRecipeRecipeId","commandsInRecipeOrder")
);

-- AddForeignKey
ALTER TABLE "CommandOptionParameterPayloadsInRecipe" ADD CONSTRAINT "CommandOptionParameterPayloadsInRecipe_commandParameterId_fkey" FOREIGN KEY ("commandParameterId") REFERENCES "CommandParameter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandOptionParameterPayloadsInRecipe" ADD CONSTRAINT "CommandOptionParameterPayloadsInRecipe_commandOptionId_fkey" FOREIGN KEY ("commandOptionId") REFERENCES "CommandOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandOptionParameterPayloadsInRecipe" ADD CONSTRAINT "CommandOptionParameterPayloadsInRecipe_commandsInRecipeCom_fkey" FOREIGN KEY ("commandsInRecipeCommandId", "commandsInRecipeRecipeId", "commandsInRecipeOrder") REFERENCES "CommandsInRecipe"("commandId", "recipeId", "order") ON DELETE CASCADE ON UPDATE CASCADE;

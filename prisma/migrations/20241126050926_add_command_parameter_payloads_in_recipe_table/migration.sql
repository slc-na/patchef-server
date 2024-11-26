/*
  Warnings:

  - The primary key for the `Command` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "CommandOption" DROP CONSTRAINT "CommandOption_commandId_fkey";

-- DropForeignKey
ALTER TABLE "CommandParameter" DROP CONSTRAINT "CommandParameter_commandId_fkey";

-- DropForeignKey
ALTER TABLE "CommandsInRecipe" DROP CONSTRAINT "CommandsInRecipe_commandId_fkey";

-- AlterTable
ALTER TABLE "Command" DROP CONSTRAINT "Command_pkey",
ADD CONSTRAINT "Command_pkey" PRIMARY KEY ("originalId");

-- CreateTable
CREATE TABLE "CommandParameterPayloadsInRecipe" (
    "payload" TEXT NOT NULL,
    "commandParameterId" TEXT NOT NULL,
    "commandsInRecipeCommandId" TEXT NOT NULL,
    "commandsInRecipeRecipeId" TEXT NOT NULL,
    "commandsInRecipeOrder" INTEGER NOT NULL,

    CONSTRAINT "CommandParameterPayloadsInRecipe_pkey" PRIMARY KEY ("commandParameterId","commandsInRecipeCommandId","commandsInRecipeRecipeId","commandsInRecipeOrder")
);

-- AddForeignKey
ALTER TABLE "CommandParameter" ADD CONSTRAINT "CommandParameter_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "Command"("originalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandOption" ADD CONSTRAINT "CommandOption_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "Command"("originalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandsInRecipe" ADD CONSTRAINT "CommandsInRecipe_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "Command"("originalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandParameterPayloadsInRecipe" ADD CONSTRAINT "CommandParameterPayloadsInRecipe_commandParameterId_fkey" FOREIGN KEY ("commandParameterId") REFERENCES "CommandParameter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandParameterPayloadsInRecipe" ADD CONSTRAINT "CommandParameterPayloadsInRecipe_commandsInRecipeCommandId_fkey" FOREIGN KEY ("commandsInRecipeCommandId", "commandsInRecipeRecipeId", "commandsInRecipeOrder") REFERENCES "CommandsInRecipe"("commandId", "recipeId", "order") ON DELETE CASCADE ON UPDATE CASCADE;

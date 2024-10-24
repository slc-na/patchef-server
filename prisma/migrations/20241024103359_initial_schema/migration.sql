-- CreateEnum
CREATE TYPE "CommandType" AS ENUM ('BASIC', 'ADVANCED');

-- CreateTable
CREATE TABLE "CommandParameter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "payload" TEXT,
    "commandOptionId" TEXT,
    "commandId" TEXT,

    CONSTRAINT "CommandParameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommandOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "delimiter" TEXT,
    "enabled" BOOLEAN NOT NULL,
    "parameterRequired" BOOLEAN NOT NULL,
    "commandId" TEXT,

    CONSTRAINT "CommandOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Command" (
    "id" TEXT NOT NULL,
    "originalId" TEXT NOT NULL,
    "type" "CommandType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "payload" TEXT NOT NULL,

    CONSTRAINT "Command_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommandsInRecipe" (
    "order" INTEGER NOT NULL,
    "commandId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "CommandsInRecipe_pkey" PRIMARY KEY ("commandId","recipeId","order")
);

-- AddForeignKey
ALTER TABLE "CommandParameter" ADD CONSTRAINT "CommandParameter_commandOptionId_fkey" FOREIGN KEY ("commandOptionId") REFERENCES "CommandOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandParameter" ADD CONSTRAINT "CommandParameter_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "Command"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandOption" ADD CONSTRAINT "CommandOption_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "Command"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandsInRecipe" ADD CONSTRAINT "CommandsInRecipe_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "Command"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommandsInRecipe" ADD CONSTRAINT "CommandsInRecipe_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

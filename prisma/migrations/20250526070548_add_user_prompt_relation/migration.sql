/*
  Warnings:

  - Added the required column `userId` to the `Prompt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Prompt` ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Prompt_userId_idx` ON `Prompt`(`userId`);

-- AddForeignKey
ALTER TABLE `Prompt` ADD CONSTRAINT `Prompt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

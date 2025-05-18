/*
  Warnings:

  - A unique constraint covering the columns `[yandex_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "yandex_id" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "User_yandex_id_key" ON "User"("yandex_id");

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

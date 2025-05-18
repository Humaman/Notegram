/*
  Warnings:

  - You are about to drop the column `is_yandex_id_active` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[yandex_password]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `yandex_password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "is_yandex_id_active",
ADD COLUMN     "yandex_id_active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "yandex_password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_yandex_password_key" ON "User"("yandex_password");

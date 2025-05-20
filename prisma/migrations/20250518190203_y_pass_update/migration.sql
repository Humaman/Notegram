/*
  Warnings:

  - You are about to drop the column `yandex_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `yandex_id_active` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_yandex_id_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "yandex_id",
DROP COLUMN "yandex_id_active";

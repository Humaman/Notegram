/*
  Warnings:

  - You are about to drop the column `isRequired` on the `Folder` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FolderType" AS ENUM ('DEFAULT', 'TRASH', 'CUSTOM');

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "isRequired",
ADD COLUMN     "type" "FolderType" NOT NULL DEFAULT 'CUSTOM';

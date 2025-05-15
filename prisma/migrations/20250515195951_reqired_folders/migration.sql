/*
  Warnings:

  - You are about to drop the column `images` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `isTrashed` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `videos` on the `Note` table. All the data in the column will be lost.
  - Made the column `folderId` on table `Note` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_folderId_fkey";

-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "isRequired" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "images",
DROP COLUMN "isTrashed",
DROP COLUMN "videos",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "video" TEXT,
ALTER COLUMN "folderId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

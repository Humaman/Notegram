/*
  Warnings:

  - Changed the type of `messageId` on the `Note` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Note" DROP COLUMN "messageId",
ADD COLUMN     "messageId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Note_messageId_key" ON "Note"("messageId");

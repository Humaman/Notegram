/*
  Warnings:

  - A unique constraint covering the columns `[messageId]` on the table `Note` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Note_messageId_key" ON "Note"("messageId");

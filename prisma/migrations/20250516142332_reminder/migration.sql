/*
  Warnings:

  - The values [DONE,CANCELED] on the enum `ReminderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Added the required column `lastSentAt` to the `Reminder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ReminderStatus_new" AS ENUM ('PENDING', 'SENT', 'CONFIRMED');
ALTER TABLE "Reminder" ALTER COLUMN "status" TYPE "ReminderStatus_new" USING ("status"::text::"ReminderStatus_new");
ALTER TYPE "ReminderStatus" RENAME TO "ReminderStatus_old";
ALTER TYPE "ReminderStatus_new" RENAME TO "ReminderStatus";
DROP TYPE "ReminderStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Reminder" ADD COLUMN     "lastSentAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "username";

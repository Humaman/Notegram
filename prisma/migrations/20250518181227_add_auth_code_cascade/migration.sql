-- DropForeignKey
ALTER TABLE "AuthCode" DROP CONSTRAINT "AuthCode_userId_fkey";

-- AddForeignKey
ALTER TABLE "AuthCode" ADD CONSTRAINT "AuthCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `userId` to the `player_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "player_details" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "player_details" ADD CONSTRAINT "player_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user_auth"("id") ON DELETE CASCADE ON UPDATE CASCADE;

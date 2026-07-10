/*
  Warnings:

  - You are about to drop the column `bloodGroup` on the `player_details` table. All the data in the column will be lost.
  - You are about to drop the column `governmentIdProof` on the `player_details` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `player_details` table. All the data in the column will be lost.
  - You are about to drop the column `nationality` on the `player_details` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `player_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "player_details" DROP COLUMN "bloodGroup",
DROP COLUMN "governmentIdProof",
DROP COLUMN "height",
DROP COLUMN "nationality",
DROP COLUMN "weight";

-- DropEnum
DROP TYPE "BloodGroup";

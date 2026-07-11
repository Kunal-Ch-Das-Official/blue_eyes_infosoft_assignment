-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('APPLIED', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "player_details" ADD COLUMN     "formStatus" "FormStatus" NOT NULL DEFAULT 'APPLIED';

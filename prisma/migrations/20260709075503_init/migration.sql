-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'A_B_POSITIVE', 'A_B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'NOT_KNOWN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHERS');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "competition_played" (
    "id" TEXT NOT NULL,
    "competitionName" TEXT NOT NULL,
    "sports" TEXT NOT NULL,
    "category" TEXT,
    "position" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "competition_played_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "player_details" (
    "id" TEXT NOT NULL,
    "playerName" TEXT NOT NULL,
    "fathersName" TEXT NOT NULL,
    "mothersName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "currentAge" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "playersPhotoUrl" TEXT NOT NULL,
    "playersPhotoPId" TEXT NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "alternateMobileNo" TEXT,
    "nationality" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL DEFAULT 'NOT_KNOWN',
    "height" TEXT,
    "weight" TEXT,
    "governmentIdProof" TEXT,
    "address" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,
    "stateOrProvince" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "club" TEXT NOT NULL,
    "sports" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "player_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players_document" (
    "id" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "documentUrl" TEXT NOT NULL,
    "documentAccessUrl" TEXT NOT NULL,
    "documentSize" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "players_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_auth" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "emailId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_auth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "competition_played_id_key" ON "competition_played"("id");

-- CreateIndex
CREATE UNIQUE INDEX "player_details_id_key" ON "player_details"("id");

-- CreateIndex
CREATE UNIQUE INDEX "player_details_emailAddress_key" ON "player_details"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "player_details_contactNumber_key" ON "player_details"("contactNumber");

-- CreateIndex
CREATE UNIQUE INDEX "player_details_alternateMobileNo_key" ON "player_details"("alternateMobileNo");

-- CreateIndex
CREATE UNIQUE INDEX "players_document_id_key" ON "players_document"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_id_key" ON "user_auth"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_auth_emailId_key" ON "user_auth"("emailId");

-- AddForeignKey
ALTER TABLE "competition_played" ADD CONSTRAINT "competition_played_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "player_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players_document" ADD CONSTRAINT "players_document_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "player_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

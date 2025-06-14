/*
  Warnings:

  - Made the column `deleted` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Attending" DROP CONSTRAINT "Attending_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Attending" DROP CONSTRAINT "Attending_userId_fkey";

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "deleted" SET NOT NULL,
ALTER COLUMN "deleted" SET DEFAULT false;

-- AddForeignKey
ALTER TABLE "Attending" ADD CONSTRAINT "Attending_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attending" ADD CONSTRAINT "Attending_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

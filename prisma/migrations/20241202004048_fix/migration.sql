/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Projects` DROP FOREIGN KEY `Projects_project_manager_id_fkey`;

-- DropForeignKey
ALTER TABLE `Projects` DROP FOREIGN KEY `Projects_tech_responsible_id_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `role` ENUM('tech_responsible', 'project_manager') NOT NULL DEFAULT 'tech_responsible';

-- CreateTable
CREATE TABLE `_ProjectsToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProjectsToUser_AB_unique`(`A`, `B`),
    INDEX `_ProjectsToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ProjectsToUser` ADD CONSTRAINT `_ProjectsToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectsToUser` ADD CONSTRAINT `_ProjectsToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

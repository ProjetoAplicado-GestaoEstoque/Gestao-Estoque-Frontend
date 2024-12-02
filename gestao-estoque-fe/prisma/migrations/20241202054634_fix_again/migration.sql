-- CreateTable
CREATE TABLE `_ItemToProjects` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ItemToProjects_AB_unique`(`A`, `B`),
    INDEX `_ItemToProjects_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ItemToProjects` ADD CONSTRAINT `_ItemToProjects_A_fkey` FOREIGN KEY (`A`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ItemToProjects` ADD CONSTRAINT `_ItemToProjects_B_fkey` FOREIGN KEY (`B`) REFERENCES `Projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

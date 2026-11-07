-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `profilePicture` VARCHAR(191) NULL,
    `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create an internal admin account so existing tasks can receive a creator.
-- The data seed in Aufgabe 3 replaces this account with the configured admin user.
INSERT INTO `User` (`email`, `password`, `role`)
VALUES (
    'migration-admin@tasklist.local',
    '$2b$12$placeholdermigrationadminpasswordhash0000000000000000000000000000',
    'admin'
);

-- Existing tasks remain valid while new relation columns are added.
ALTER TABLE `Task`
    ADD COLUMN `createdById` INTEGER NULL,
    ADD COLUMN `assignedToId` INTEGER NULL;

UPDATE `Task`
SET `createdById` = (
    SELECT `id`
    FROM `User`
    WHERE `email` = 'migration-admin@tasklist.local'
)
WHERE `createdById` IS NULL;

ALTER TABLE `Task`
    MODIFY COLUMN `createdById` INTEGER NOT NULL;

CREATE INDEX `Task_createdById_idx` ON `Task`(`createdById`);
CREATE INDEX `Task_assignedToId_idx` ON `Task`(`assignedToId`);

ALTER TABLE `Task`
    ADD CONSTRAINT `Task_createdById_fkey`
    FOREIGN KEY (`createdById`) REFERENCES `User`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
    ADD CONSTRAINT `Task_assignedToId_fkey`
    FOREIGN KEY (`assignedToId`) REFERENCES `User`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;

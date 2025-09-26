-- AlterTable
ALTER TABLE `OAuthAccount` MODIFY `accessToken` TEXT NOT NULL,
    MODIFY `refreshToken` TEXT NULL,
    MODIFY `scope` TEXT NULL,
    MODIFY `idToken` TEXT NULL;
